import {
  deductCredits,
  getUserCreditBalanceByEmail,
  getUserIdByEmail,
} from "@/lib/user-credits";

export type RequireCreditsResult =
  | { ok: true; balanceAfter: number }
  | {
      ok: false;
      creditsRequired: number;
      creditsAvailable: number;
    };

/** Balance check only — use before heavy work so users fail fast. */
export async function checkCredits(input: {
  userEmail: string;
  amount: number;
}): Promise<RequireCreditsResult> {
  const balance = await getUserCreditBalanceByEmail(input.userEmail);
  const creditsAvailable = balance?.credits ?? 0;
  if (!balance || creditsAvailable < input.amount) {
    return { ok: false, creditsRequired: input.amount, creditsAvailable };
  }
  return { ok: true, balanceAfter: creditsAvailable };
}

/** Same pattern as tell's AI Video Generator — charge before fal runs. */
export async function requireCredits(input: {
  userEmail: string;
  amount: number;
  description: string;
}): Promise<RequireCreditsResult> {
  const checked = await checkCredits({
    userEmail: input.userEmail,
    amount: input.amount,
  });
  if (!checked.ok) return checked;

  const creditsAvailable = checked.balanceAfter;

  const userId = await getUserIdByEmail(input.userEmail);
  if (!userId) {
    return { ok: false, creditsRequired: input.amount, creditsAvailable: 0 };
  }

  const result = await deductCredits({
    userId,
    amount: input.amount,
    description: input.description,
  });
  if (!result) {
    return {
      ok: false,
      creditsRequired: input.amount,
      creditsAvailable,
    };
  }

  return { ok: true, balanceAfter: result.balanceAfter };
}
