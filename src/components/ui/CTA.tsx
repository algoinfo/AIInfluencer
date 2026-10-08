import { Button } from "@/components/ui/Button";

type CTAProps = {
  title: string;
  body?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  externalPrimary?: boolean;
};

export function CTA({
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  externalPrimary,
}: CTAProps) {
  return (
    <section className="section-pad border-t border-border">
      <div className="page-shell">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(216,255,62,0.1),transparent_55%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              {title}
            </h2>
            {body ? (
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
                {body}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                href={primaryHref}
                size="lg"
                external={externalPrimary}
              >
                {primaryLabel}
              </Button>
              {secondaryHref && secondaryLabel ? (
                <Button href={secondaryHref} variant="secondary" size="lg">
                  {secondaryLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
