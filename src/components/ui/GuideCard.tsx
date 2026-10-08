import Link from "next/link";

export type GuideCardProps = {
  href: string;
  title: string;
  excerpt: string;
  readTime?: string;
  index?: string;
};

export function GuideCard({
  href,
  title,
  excerpt,
  readTime,
  index,
}: GuideCardProps) {
  return (
    <Link
      href={href}
      className="group grid gap-4 border-t border-border py-8 transition-colors first:border-t-0 sm:grid-cols-[auto_1fr_auto] sm:items-baseline"
    >
      {index ? (
        <span className="font-display text-sm tracking-[0.18em] text-fg-subtle">
          {index}
        </span>
      ) : null}
      <div>
        <h3 className="font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
          {title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted sm:text-base">
          {excerpt}
        </p>
      </div>
      {readTime ? (
        <span className="text-xs uppercase tracking-[0.16em] text-fg-subtle">
          {readTime}
        </span>
      ) : null}
    </Link>
  );
}
