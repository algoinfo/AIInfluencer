import { WELCOME_CREDITS } from "@/lib/credit-limits";
import { CREDITS_PER_SECOND } from "@/data/credits";

/** $1 → 1,000 credits (1 credit = $0.001) */
export const CREDITS_PER_DOLLAR = 1000;

export const PRICING_HERO = {
  headline: "Pay once. Credits for every video.",
  subhead:
    "One-time credit packs for Genjutsu motion transfer. Base credits match your payment — bonus on every pack. No subscription.",
} as const;

export const PRICING_FREE = {
  title: "Free",
  priceLabel: "$0",
  tagline: "Sign up free, then generate with welcome credits.",
  includes: [
    `New accounts: ${WELCOME_CREDITS.toLocaleString()} welcome credits`,
    "Login required to generate",
    "Explore examples",
    "Upload character + reference workflow",
  ],
} as const;

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  baseCredits: number;
  bonusPercent: number;
  credits: number;
  usageExamples: string;
  tagline: string;
  highlight?: boolean;
  badge?: string;
}

function buildTier(
  input: Omit<PricingTier, "baseCredits" | "credits"> & {
    bonusPercent: number;
    credits: number;
  },
): PricingTier {
  const baseCredits = Math.round(input.price * CREDITS_PER_DOLLAR);
  return { ...input, baseCredits };
}

function secondsLabel(credits: number) {
  const seconds = Math.floor(credits / CREDITS_PER_SECOND);
  return `~${seconds}s of video at base rate`;
}

/** One-time packs — base = price × 1000; bonus credits on top */
export const PRICING_TIERS: PricingTier[] = [
  buildTier({
    id: "basic",
    name: "Basic",
    price: 9.9,
    bonusPercent: 10,
    credits: 10890,
    usageExamples: secondsLabel(10890),
    tagline: "Start generating — solid first pack",
  }),
  buildTier({
    id: "creator",
    name: "Creator",
    price: 19.9,
    bonusPercent: 15,
    credits: 22885,
    usageExamples: secondsLabel(22885),
    tagline: "Sweet spot — more bonus credits per dollar",
    highlight: true,
    badge: "Most popular",
  }),
  buildTier({
    id: "pro",
    name: "Pro",
    price: 69,
    bonusPercent: 25,
    credits: 86250,
    usageExamples: secondsLabel(86250),
    tagline: "Maximum credits for heavy production",
  }),
];

export const PRICING_INCLUDES = [
  "One-time payment — credits never expire",
  "Base credits match your payment; bonus on every pack",
  "No watermark on exports",
  "Motion transfer at 100 credits / second",
] as const;

export function getPricingTier(tierId: string): PricingTier | undefined {
  return PRICING_TIERS.find((tier) => tier.id === tierId);
}

export function formatTierPrice(price: number): string {
  return Number.isInteger(price) ? String(price) : price.toFixed(1);
}

export function formatTierCredits(credits: number): string {
  return credits.toLocaleString("en-US");
}

export function formatBonusLabel(tier: PricingTier): string {
  if (tier.bonusPercent <= 0) return formatTierCredits(tier.credits);
  const bonus = tier.credits - tier.baseCredits;
  return `${formatTierCredits(tier.credits)} (+${formatTierCredits(bonus)} bonus)`;
}
