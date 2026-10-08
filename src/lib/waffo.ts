import { WaffoPancake } from "@waffo/pancake-ts";

export type WaffoEnvironment = "test" | "prod";

export function getWaffoEnvironment(): WaffoEnvironment {
  const value = process.env.WAFFO_ENVIRONMENT?.trim().toLowerCase();
  if (value === "prod" || value === "production") return "prod";
  if (value === "test") return "test";
  if (process.env.VERCEL_ENV === "production") return "prod";
  return "test";
}

export function isWaffoConfigured(): boolean {
  return (
    !!process.env.WAFFO_MERCHANT_ID?.trim() &&
    !!process.env.WAFFO_PRIVATE_KEY?.trim()
  );
}

let client: WaffoPancake | null = null;

export function getWaffoClient(): WaffoPancake {
  const merchantId = process.env.WAFFO_MERCHANT_ID?.trim();
  const privateKey = process.env.WAFFO_PRIVATE_KEY?.trim();
  if (!merchantId || !privateKey) {
    throw new Error("WAFFO_MERCHANT_ID / WAFFO_PRIVATE_KEY are not configured.");
  }
  if (!client) {
    client = new WaffoPancake({
      merchantId,
      privateKey,
      environment: getWaffoEnvironment(),
    });
  }
  return client;
}
