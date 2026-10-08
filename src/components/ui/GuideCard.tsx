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
      className="group relative flex flex-col gap-4 py-7 transition-colors sm:flex-row sm:items-start sm:gap-6 sm:py-8"
    >
      {index ? (
        <span
          aria-hidden
          className="font-mono text-[0.75rem] font-semibold tabular-nums tracking-[0.14em] text-accent/90 sm:mt-1.5 sm:w-10 sm:shrink-0"
        >
          {index}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-[1.35rem] font-semibold leading-snug tracking-tight text-fg transition-colors group-hover:text-accent sm:text-[1.65rem]">
          {title}
        </h3>
        <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-fg-muted">
          {excerpt}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {readTime ? (
            <span className="rounded-md bg-white/[0.06] px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-fg-subtle ring-1 ring-inset ring-white/[0.08]">
              {readTime} read
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-accent transition group-hover:gap-2.5">
            Read guide
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
