import Link from "next/link";
import { PricingCheckoutButton } from "@/components/pricing/PricingCheckoutButton";
import { CREDITS_PER_SECOND } from "@/data/credits";
import {
  formatBonusLabel,
  formatTierCredits,
  formatTierPrice,
  PRICING_FREE,
  PRICING_INCLUDES,
  PRICING_TIERS,
} from "@/data/pricing";

type CreditsPricingProps = {
  compact?: boolean;
};

export function CreditsPricing({ compact = false }: CreditsPricingProps) {
  const tiers = compact
    ? PRICING_TIERS.filter((tier) => tier.id === "basic" || tier.id === "creator")
    : PRICING_TIERS;

  return (
    <div>
      {!compact ? (
        <p className="mx-auto max-w-xl text-center text-sm text-fg-muted">
          1 credit = $0.001 · {CREDITS_PER_SECOND} credits / second · one-time
          packs, never expire
        </p>
      ) : null}

      <ul
        className={[
          "mt-8 grid gap-5",
          compact
            ? "mx-auto max-w-3xl sm:grid-cols-2"
            : "sm:grid-cols-2 lg:grid-cols-4",
        ].join(" ")}
      >
        {!compact ? (
          <li className="flex flex-col rounded-2xl border border-dashed border-white/15 bg-surface/40 p-6">
            <h3 className="font-display text-xl font-semibold text-fg">
              {PRICING_FREE.title}
            </h3>
            <p className="mt-1 text-sm text-fg-muted">{PRICING_FREE.tagline}</p>

            <p className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold text-fg">
                {PRICING_FREE.priceLabel}
              </span>
              <span className="text-sm text-fg-subtle">forever</span>
            </p>

            <ul className="mt-6 flex-1 space-y-2.5 border-t border-white/[0.08] pt-6 text-sm text-fg-muted">
              {PRICING_FREE.includes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-accent" aria-hidden="true">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/#studio"
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full border border-white/12 text-sm font-semibold text-fg transition hover:bg-white/[0.04]"
            >
              Try free
            </Link>
          </li>
        ) : null}

        {tiers.map((tier) => (
          <li
            key={tier.id}
            className={[
              "relative flex flex-col rounded-2xl border p-6",
              tier.highlight
                ? "border-accent/35 bg-surface shadow-[0_0_40px_rgba(216,255,62,0.06)] lg:scale-[1.02]"
                : "border-border bg-surface/50",
            ].join(" ")}
          >
            {tier.badge ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-[#0a0a0c]">
                {tier.badge}
              </span>
            ) : null}

            <h3 className="font-display text-xl font-semibold text-fg">
              {tier.name}
            </h3>
            <p className="mt-1 text-sm text-fg-muted">{tier.tagline}</p>

            <p className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold text-fg">
                ${formatTierPrice(tier.price)}
              </span>
              <span className="text-sm text-fg-subtle">one-time</span>
            </p>

            <div className="mt-6 space-y-3 border-t border-white/[0.08] pt-6 text-sm">
              <p className="flex justify-between gap-4">
                <span className="text-fg-muted">Base credits</span>
                <span className="tabular-nums font-semibold text-fg">
                  {formatTierCredits(tier.baseCredits)}
                </span>
              </p>
              {tier.bonusPercent > 0 ? (
                <p className="flex justify-between gap-4">
                  <span className="text-fg-muted">Bonus</span>
                  <span className="tabular-nums font-medium text-accent">
                    +{formatTierCredits(tier.credits - tier.baseCredits)} (+
                    {tier.bonusPercent}%)
                  </span>
                </p>
              ) : null}
              <p className="flex justify-between gap-4 border-t border-white/[0.08] pt-3">
                <span className="text-fg-muted">You receive</span>
                <span className="text-right tabular-nums font-semibold text-fg">
                  {formatBonusLabel(tier)}
                </span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-fg-muted">You can make</span>
                <span className="text-right font-medium text-fg">
                  {tier.usageExamples}
                </span>
              </p>
            </div>

            {!compact ? (
              <ul className="mt-4 flex-1 space-y-2 text-sm text-fg-muted">
                {PRICING_INCLUDES.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-accent" aria-hidden="true">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex-1" />
            )}

            <PricingCheckoutButton
              tierId={tier.id}
              tierName={tier.name}
              highlight={tier.highlight}
            />
          </li>
        ))}
      </ul>

      {!compact ? (
        <p className="mx-auto mt-10 max-w-xl text-center text-xs leading-relaxed text-fg-subtle">
          Credits are deducted per second of generated video. Packs never expire.
          Log in to purchase — checkout opens when payment is connected.
        </p>
      ) : null}
    </div>
  );
}
