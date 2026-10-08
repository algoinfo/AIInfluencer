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

/** Same pattern as tell's AI Video Generator — charge before fal runs. */
export async function requireCredits(input: {
  userEmail: string;
  amount: number;
  description: string;
}): Promise<RequireCreditsResult> {
  const balance = await getUserCreditBalanceByEmail(input.userEmail);
  const creditsAvailable = balance?.credits ?? 0;
  if (!balance || creditsAvailable < input.amount) {
    return { ok: false, creditsRequired: input.amount, creditsAvailable };
  }

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
    return { ok: false, creditsRequired: input.amount, creditsAvailable };
  }

  return { ok: true, balanceAfter: result.balanceAfter };
}
