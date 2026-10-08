import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type Cta = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type SeoPageShellProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  ctas?: Cta[];
};

export function SeoPageShell({
  eyebrow,
  title,
  subtitle,
  children,
  ctas = [],
}: SeoPageShellProps) {
  return (
    <div className="page-shell pb-20 pt-[112px]">
      <div className="max-w-3xl">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-fg-muted">{subtitle}</p>
        {ctas.length ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {ctas.map((cta) => (
              <Button
                key={cta.href + cta.label}
                href={cta.href}
                variant={cta.variant || "primary"}
              >
                {cta.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-12">{children}</div>
    </div>
  );
}
