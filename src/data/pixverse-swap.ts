import { PROFIT_RATE, USD_PER_CREDIT } from "@/data/credits";

/** fal-ai/pixverse/swap resolution options (1080p not supported). */
export type PixverseSwapResolution = "360p" | "540p" | "720p";

export type PixverseSwapMode = "person" | "object" | "background";

/** fal list price USD per second (≤5s band amortized). */
export const PIXVERSE_SWAP_COST_USD_PER_SEC: Record<
  PixverseSwapResolution,
  number
> = {
  "360p": 0.03, // $0.15 / 5s
  "540p": 0.03,
  "720p": 0.04, // $0.20 / 5s
};

export const PIXVERSE_SWAP_RESOLUTIONS: PixverseSwapResolution[] = [
  "360p",
  "540p",
  "720p",
];

export const PIXVERSE_SWAP_MODES: PixverseSwapMode[] = [
  "person",
  "object",
  "background",
];

export const PIXVERSE_SWAP_DEFAULT_RESOLUTION: PixverseSwapResolution = "720p";

export const PIXVERSE_SWAP_DEFAULT_MODE: PixverseSwapMode = "object";

/** Sell credits/s = cost USD/s × (1 + PROFIT_RATE) / USD_PER_CREDIT */
export function pixverseSwapCreditsPerSecond(
  resolution: PixverseSwapResolution = PIXVERSE_SWAP_DEFAULT_RESOLUTION,
): number {
  const costUsd = PIXVERSE_SWAP_COST_USD_PER_SEC[resolution];
  const sellUsd = costUsd * (1 + PROFIT_RATE);
  return Math.round(sellUsd / USD_PER_CREDIT);
}

export function creditsForPixverseSwapRun(
  seconds: number,
  resolution: PixverseSwapResolution = PIXVERSE_SWAP_DEFAULT_RESOLUTION,
): number {
  return Math.round(
    Math.max(1, seconds) * pixverseSwapCreditsPerSecond(resolution),
  );
}

export function parsePixverseSwapResolution(
  value: string | null | undefined,
): PixverseSwapResolution {
  if (value === "360p" || value === "540p" || value === "720p") return value;
  if (value === "480p") return "540p";
  if (value === "1080p") return "720p";
  return PIXVERSE_SWAP_DEFAULT_RESOLUTION;
}

export function parsePixverseSwapMode(
  value: string | null | undefined,
): PixverseSwapMode {
  if (value === "person" || value === "object" || value === "background") {
    return value;
  }
  return PIXVERSE_SWAP_DEFAULT_MODE;
}
