import Link from "next/link";

export type ToolCardProps = {
  name: string;
  description: string;
  category: string;
  href: string;
  initial: string;
};

export function ToolCard({
  name,
  description,
  category,
  href,
  initial,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-border bg-surface/50 p-6 transition-all duration-300 hover:border-border-strong hover:bg-surface"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg-soft font-display text-lg font-semibold text-accent transition-colors group-hover:border-accent/30">
          {initial}
        </div>
        <span className="text-[0.65rem] uppercase tracking-[0.16em] text-fg-subtle">
          {category}
        </span>
      </div>
      <h3 className="font-display mt-5 text-xl font-semibold tracking-tight">
        {name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
        {description}
      </p>
    </Link>
  );
}
