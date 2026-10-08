/** 1 credit = 0.1 US cents = $0.001 */
export const CENTS_PER_CREDIT = 0.1;
export const USD_PER_CREDIT = CENTS_PER_CREDIT / 100; // $0.001

/** Credits charged per second of output duration */
export const CREDITS_PER_SECOND = 100;

export type DurationOption = {
  seconds: number;
  label: string;
};

export const durationOptions: DurationOption[] = [
  { seconds: 5, label: "5s" },
  { seconds: 10, label: "10s" },
  { seconds: 15, label: "15s" },
  { seconds: 30, label: "30s" },
];

export function creditsForDuration(seconds: number) {
  return seconds * CREDITS_PER_SECOND;
}

/** Sell ≈ cost × (1 + 200%) → cost = sell / 3, profit = sell × 2/3 */
export const PROFIT_RATE = 2; // 200%

export function creditsForRun(seconds: number, modelMultiplier = 1) {
  return Math.round(seconds * CREDITS_PER_SECOND * modelMultiplier);
}

export function costCreditsFromSell(sellCredits: number) {
  return Math.round((sellCredits / (1 + PROFIT_RATE)) * 100) / 100;
}

export function profitCreditsFromSell(sellCredits: number) {
  return Math.round((sellCredits - costCreditsFromSell(sellCredits)) * 100) / 100;
}

export function formatUsdAmount(usd: number) {
  if (usd < 0.01) return `$${usd.toFixed(3)}`;
  return usd < 1 ? `$${usd.toFixed(2)}` : `$${usd.toFixed(usd % 1 === 0 ? 0 : 2)}`;
}

export type CreditPack = {
  id: string;
  name: string;
  credits: number;
  featured?: boolean;
  lines: string[];
};

export const creditPacks: CreditPack[] = [
  {
    id: "basic",
    name: "Basic",
    credits: 10890,
    lines: [
      "10,890 credits",
      "$9.9 one-time",
      `≈ ${Math.floor(10890 / CREDITS_PER_SECOND)}s of video`,
    ],
  },
  {
    id: "creator",
    name: "Creator",
    credits: 22885,
    featured: true,
    lines: [
      "22,885 credits",
      "$19.9 one-time",
      `≈ ${Math.floor(22885 / CREDITS_PER_SECOND)}s of video`,
    ],
  },
  {
    id: "pro",
    name: "Pro",
    credits: 86250,
    lines: [
      "86,250 credits",
      "$69 one-time",
      `≈ ${Math.floor(86250 / CREDITS_PER_SECOND)}s of video`,
    ],
  },
];

export function creditsToCents(credits: number) {
  return Math.round(credits * CENTS_PER_CREDIT * 100) / 100;
}

export function creditsToUsd(credits: number) {
  return Math.round(credits * USD_PER_CREDIT * 1000) / 1000;
}

export function formatUsd(credits: number) {
  const usd = creditsToUsd(credits);
  return usd < 1 ? `$${usd.toFixed(2)}` : `$${usd.toFixed(usd % 1 === 0 ? 0 : 2)}`;
}

export function formatCents(credits: number) {
  const cents = creditsToCents(credits);
  return `${cents}¢`;
}
