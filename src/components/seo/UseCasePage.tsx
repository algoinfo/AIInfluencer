import Link from "next/link";
import { CTA } from "@/components/ui/CTA";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PageHero } from "@/components/ui/PageHero";
import { VideoDemo } from "@/components/ui/VideoDemo";

export type UseCaseSection = {
  heading: string;
  paragraphs: string[];
};

export type UseCaseFaq = {
  q: string;
  a: string;
};

type CtaLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type UseCasePageProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  tags?: string[];
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
  demos?: { label: string; tone: "character" | "reference" | "output" }[];
  features: { title: string; body: string }[];
  sections: UseCaseSection[];
  faq: UseCaseFaq[];
  related: { href: string; label: string }[];
  ctaTitle: string;
  ctaBody: string;
};

export function UseCasePage({
  eyebrow,
  title,
  subtitle,
  tags,
  primaryCta,
  secondaryCta,
  demos = [
    { label: "Character", tone: "character" },
    { label: "Reference", tone: "reference" },
    { label: "Output", tone: "output" },
  ],
  features,
  sections,
  faq,
  related,
  ctaTitle,
  ctaBody,
}: UseCasePageProps) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        tags={tags}
        ctas={[
          {
            href: primaryCta.href,
            label: primaryCta.label,
            external: primaryCta.external,
          },
          ...(secondaryCta
            ? [
                {
                  href: secondaryCta.href,
                  label: secondaryCta.label,
                  variant: "secondary" as const,
                  external: secondaryCta.external,
                },
              ]
            : []),
        ]}
      />

      <section className="section-pad">
        <div className="page-shell">
          <div className="grid gap-4 md:grid-cols-3">
            {demos.map((demo) => (
              <VideoDemo key={demo.label} label={demo.label} tone={demo.tone} />
            ))}
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {features.map((item, index) => (
              <FeatureCard
                key={item.title}
                index={String(index + 1).padStart(2, "0")}
                title={item.title}
                body={item.body}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-border bg-bg-soft">
        <div className="page-shell max-w-3xl space-y-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-fg-muted">
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 56)}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad border-t border-border">
        <div className="page-shell max-w-3xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            FAQ
          </h2>
          <dl className="mt-8 space-y-6">
            {faq.map((item) => (
              <div key={item.q}>
                <dt className="font-medium text-fg">{item.q}</dt>
                <dd className="mt-2 text-base leading-relaxed text-fg-muted">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
          {related.length ? (
            <div className="mt-10 flex flex-wrap gap-3 text-sm">
              {related.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-border px-3 py-1.5 text-fg-muted transition hover:text-fg"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <CTA
        title={ctaTitle}
        body={ctaBody}
        primaryHref={primaryCta.href}
        primaryLabel={primaryCta.label}
        externalPrimary={primaryCta.external}
        secondaryHref={
          secondaryCta && !secondaryCta.external
            ? secondaryCta.href
            : "/examples"
        }
        secondaryLabel={
          secondaryCta && !secondaryCta.external
            ? secondaryCta.label
            : "See Examples"
        }
      />
    </>
  );
}
