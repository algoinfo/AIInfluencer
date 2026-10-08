import { fal } from "@fal-ai/client";

export function getFalKeyFromEnv(): string | null {
  const key = process.env.FAL_KEY?.trim();
  return key || null;
}

export function configureFal(key: string) {
  fal.config({ credentials: key });
}

export { fal };
