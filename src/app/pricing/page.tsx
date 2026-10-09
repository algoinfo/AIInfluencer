import { CreditsPricing } from "@/components/pricing/CreditsPricing";
import { pageMetadata } from "@/lib/seo";
import { PRICING_HERO, PRICING_TIERS, formatTierCredits } from "@/data/pricing";

export const metadata = pageMetadata({
  title: "Pricing — Credit Packs for AI Video",
  description:
    "Genjutsu one-time credit packs for motion transfer and object swap. Pay once, bonus on every pack, credits never expire.",
  path: "/pricing",
  keywords: [
    "Genjutsu pricing",
    "AI video credits",
    "motion transfer pricing",
    "buy AI video credits",
  ],
});

const faqs = [
  {
    q: "How much is 1 credit?",
    a: "1 credit = $0.001. Pack base credits match what you pay ($1 → 1,000 credits), then bonus is added.",
  },
  {
    q: "How does duration affect credits?",
    a: "Credits follow your uploaded video length. Motion Transfer uses 100 credits/s × model multiplier. Object Swap prices by resolution (360p / 540p / 720p) with the studio markup applied.",
  },
  {
    q: "Do credits expire?",
    a: "No. One-time packs never expire and work across Genjutsu motion transfer runs.",
  },
  {
    q: "Is checkout live?",
    a: "Login is required to buy. Checkout opens Waffo in a new tab; credits land on your account after payment.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="cinema-bg border-b border-border pt-[112px]">
        <div className="page-shell pb-12 pt-6 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            Pricing
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
            {PRICING_HERO.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
            {PRICING_HERO.subhead}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="page-shell">
          <CreditsPricing />
        </div>
      </section>

      <section className="section-pad border-t border-border bg-bg-soft">
        <div className="page-shell">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Pack overview
          </h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface text-fg-subtle">
                <tr>
                  <th className="px-4 py-3 font-medium">Pack</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">You receive</th>
                  <th className="px-4 py-3 font-medium">Approx. video</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_TIERS.map((tier) => (
                  <tr key={tier.id} className="border-t border-border">
                    <td className="px-4 py-3 text-fg">{tier.name}</td>
                    <td className="px-4 py-3 text-fg-muted">${tier.price}</td>
                    <td className="px-4 py-3 text-fg-muted">
                      {formatTierCredits(tier.credits)}
                    </td>
                    <td className="px-4 py-3 text-fg-muted">
                      {tier.usageExamples}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-border">
        <div className="page-shell max-w-3xl space-y-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            FAQ
          </h2>
          {faqs.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-border bg-surface/50 p-5"
            >
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {item.q}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
