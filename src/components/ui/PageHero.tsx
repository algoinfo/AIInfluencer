import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type Cta = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  external?: boolean;
};

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  tags?: string[];
  ctas?: Cta[];
  children?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  tags,
  ctas = [],
  children,
}: PageHeroProps) {
  return (
    <section className="cinema-bg border-b border-border pt-[112px]">
      <div className="page-shell pb-14 pt-6">
        <div className="max-w-3xl">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">
            {subtitle}
          </p>
          {tags?.length ? (
            <p className="mt-4 text-sm tracking-wide text-fg-subtle">
              {tags.join(" · ")}
            </p>
          ) : null}
          {ctas.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {ctas.map((cta) => (
                <Button
                  key={cta.href + cta.label}
                  href={cta.href}
                  variant={cta.variant || "primary"}
                  external={cta.external}
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
