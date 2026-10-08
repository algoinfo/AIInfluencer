import { PROFIT_RATE, USD_PER_CREDIT } from "@/data/credits";

export type GenjutsuResolution = "480p" | "720p" | "1080p";

/** Higgsfield Genjutsu cost USD per second of input (before markup). */
export const GENJUTSU_COST_USD_PER_SEC: Record<GenjutsuResolution, number> = {
  "480p": 0.318,
  "720p": 0.681,
  "1080p": 1.632,
};

export const GENJUTSU_RESOLUTIONS: GenjutsuResolution[] = [
  "480p",
  "720p",
  "1080p",
];

export const GENJUTSU_DEFAULT_RESOLUTION: GenjutsuResolution = "720p";

/** Source video must be at least 4s (HF Genjutsu Object Swap). */
export const GENJUTSU_MIN_DURATION_SEC = 4;

/** Sell credits/s = cost USD/s × (1 + PROFIT_RATE) / USD_PER_CREDIT */
export function genjutsuCreditsPerSecond(
  resolution: GenjutsuResolution = GENJUTSU_DEFAULT_RESOLUTION,
): number {
  const costUsd = GENJUTSU_COST_USD_PER_SEC[resolution];
  const sellUsd = costUsd * (1 + PROFIT_RATE);
  return Math.round(sellUsd / USD_PER_CREDIT);
}

export function creditsForGenjutsuRun(
  seconds: number,
  resolution: GenjutsuResolution = GENJUTSU_DEFAULT_RESOLUTION,
): number {
  return Math.round(Math.max(1, seconds) * genjutsuCreditsPerSecond(resolution));
}

export function parseGenjutsuResolution(
  value: string | null | undefined,
): GenjutsuResolution {
  if (value === "480p" || value === "720p" || value === "1080p") return value;
  return GENJUTSU_DEFAULT_RESOLUTION;
}
