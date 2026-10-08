import { randomUUID } from "crypto";
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
