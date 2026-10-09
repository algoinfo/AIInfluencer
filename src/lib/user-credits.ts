import { randomUUID } from "crypto";
import { getPricingTier } from "@/data/pricing";
import { WELCOME_CREDITS } from "@/lib/credit-limits";
import { ensureSchema, getDb } from "@/lib/db";

export { WELCOME_CREDITS };

const WELCOME_BONUS_DESCRIPTION_PREFIX = "Welcome bonus";

export interface UserCreditBalance {
  credits: number;
}

export async function getUserCreditBalance(
  userId: string,
): Promise<UserCreditBalance> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT credits_balance FROM users WHERE id = ? LIMIT 1",
    args: [userId],
  });
  return { credits: Number(result.rows[0]?.credits_balance ?? 0) };
}

export async function getUserCreditBalanceByEmail(
  email: string,
): Promise<UserCreditBalance | null> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT credits_balance FROM users WHERE email = ? LIMIT 1`,
    args: [email.trim().toLowerCase()],
  });
  const row = result.rows[0];
  if (!row) return null;
  return { credits: Number(row.credits_balance ?? 0) };
}

export async function getUserIdByEmail(email: string): Promise<string | null> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id FROM users WHERE email = ? LIMIT 1",
    args: [email.trim().toLowerCase()],
  });
  const id = result.rows[0]?.id;
  return typeof id === "string" ? id : null;
}

export async function deductCredits(input: {
  userId: string;
  amount: number;
  description: string;
}): Promise<{ balanceAfter: number } | null> {
  if (input.amount <= 0) {
    throw new Error("Deduction amount must be positive.");
  }

  await ensureSchema();
  const db = getDb();

  const balance = await getUserCreditBalance(input.userId);
  if (balance.credits < input.amount) return null;

  await db.execute({
    sql: `UPDATE users
          SET credits_balance = credits_balance - ?
          WHERE id = ? AND credits_balance >= ?`,
    args: [input.amount, input.userId, input.amount],
  });

  const after = await getUserCreditBalance(input.userId);
  const expected = balance.credits - input.amount;
  if (after.credits !== expected) return null;

  await db.execute({
    sql: `INSERT INTO credit_transactions (
            id, user_id, type, amount, balance_after, description
          ) VALUES (?, ?, 'usage', ?, ?, ?)`,
    args: [
      randomUUID(),
      input.userId,
      -input.amount,
      after.credits,
      input.description,
    ],
  });

  return { balanceAfter: after.credits };
}

export async function grantWelcomeCreditsIfNeeded(
  userId: string,
): Promise<{ granted: boolean; balanceAfter?: number }> {
  await ensureSchema();
  const db = getDb();

  const existing = await db.execute({
    sql: `SELECT 1 FROM credit_transactions
          WHERE user_id = ? AND type = 'adjustment' AND description LIKE ?
          LIMIT 1`,
    args: [userId, `${WELCOME_BONUS_DESCRIPTION_PREFIX}%`],
  });
  if (existing.rows.length > 0) {
    return { granted: false };
  }

  await db.execute({
    sql: `UPDATE users SET credits_balance = credits_balance + ? WHERE id = ?`,
    args: [WELCOME_CREDITS, userId],
  });

  const balance = await getUserCreditBalance(userId);

  await db.execute({
    sql: `INSERT INTO credit_transactions (
            id, user_id, type, amount, balance_after, description
          ) VALUES (?, ?, 'adjustment', ?, ?, ?)`,
    args: [
      randomUUID(),
      userId,
      WELCOME_CREDITS,
      balance.credits,
      `${WELCOME_BONUS_DESCRIPTION_PREFIX} — ${WELCOME_CREDITS} free credits`,
    ],
  });

  return { granted: true, balanceAfter: balance.credits };
}

export interface PurchaseResult {
  paymentId: string;
  creditsGranted: number;
  balanceAfter: number;
}

async function getPaymentByProviderRef(
  providerRef: string,
): Promise<PurchaseResult | null> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT p.id, p.credits_granted, u.credits_balance
          FROM payments p
          JOIN users u ON u.id = p.user_id
          WHERE p.provider_ref = ?
          LIMIT 1`,
    args: [providerRef],
  });
  const row = result.rows[0];
  if (!row) return null;
  return {
    paymentId: String(row.id),
    creditsGranted: Number(row.credits_granted),
    balanceAfter: Number(row.credits_balance),
  };
}

export async function completeTierPurchase(input: {
  userId: string;
  tierId: string;
  provider?: string;
  providerRef?: string;
}): Promise<PurchaseResult> {
  await ensureSchema();

  if (input.providerRef) {
    const existing = await getPaymentByProviderRef(input.providerRef);
    if (existing) return existing;
  }

  const tier = getPricingTier(input.tierId);
  if (!tier) {
    throw new Error("Unknown pricing tier.");
  }

  const db = getDb();
  const paymentId = randomUUID();
  const txId = randomUUID();
  const amountCents = Math.round(tier.price * 100);
  const bonusCredits = tier.credits - tier.baseCredits;

  await db.execute({
    sql: `UPDATE users SET credits_balance = credits_balance + ? WHERE id = ?`,
    args: [tier.credits, input.userId],
  });

  const updated = await getUserCreditBalance(input.userId);
  const balanceAfter = updated.credits;

  try {
    await db.execute({
      sql: `INSERT INTO payments (
              id, user_id, tier_id, amount_cents, credits_granted,
              provider, provider_ref, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'completed')`,
      args: [
        paymentId,
        input.userId,
        tier.id,
        amountCents,
        tier.credits,
        input.provider ?? null,
        input.providerRef ?? null,
      ],
    });
  } catch (error) {
    if (input.providerRef) {
      const existing = await getPaymentByProviderRef(input.providerRef);
      if (existing) return existing;
    }
    throw error;
  }

  const description =
    bonusCredits > 0
      ? `${tier.name} pack — ${tier.credits.toLocaleString("en-US")} credits (+${bonusCredits.toLocaleString("en-US")} bonus)`
      : `${tier.name} pack — ${tier.credits.toLocaleString("en-US")} credits`;

  await db.execute({
    sql: `INSERT INTO credit_transactions (
            id, user_id, type, amount, balance_after, description, payment_id
          ) VALUES (?, ?, 'purchase', ?, ?, ?, ?)`,
    args: [txId, input.userId, tier.credits, balanceAfter, description, paymentId],
  });

  console.log("[credits] purchase granted", {
    userId: input.userId,
    tierId: tier.id,
    creditsGranted: tier.credits,
    balanceAfter,
    provider: input.provider,
    providerRef: input.providerRef,
  });

  return {
    paymentId,
    creditsGranted: tier.credits,
    balanceAfter,
  };
}

export async function completeTierPurchaseByEmail(input: {
  email: string;
  tierId: string;
  provider?: string;
  providerRef?: string;
}): Promise<PurchaseResult> {
  const userId = await getUserIdByEmail(input.email);
  if (!userId) {
    throw new Error("User not found.");
  }
  return completeTierPurchase({
    userId,
    tierId: input.tierId,
    provider: input.provider,
    providerRef: input.providerRef,
  });
}
