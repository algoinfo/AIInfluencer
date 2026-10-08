type FeatureCardProps = {
  title: string;
  body: string;
  index?: string;
};

export function FeatureCard({ title, body, index }: FeatureCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface/50 p-6 transition-colors hover:border-border-strong hover:bg-surface">
      {index ? (
        <p className="text-xs uppercase tracking-[0.18em] text-accent">{index}</p>
      ) : null}
      <h3 className="font-display mt-3 text-xl font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-fg-muted">{body}</p>
    </article>
  );
}
