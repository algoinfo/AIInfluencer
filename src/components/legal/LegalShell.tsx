export function LegalSection({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <h2 className="font-display text-xl font-semibold text-fg">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-fg-muted sm:text-base">
        {children}
      </div>
    </section>
  );
}

export function LegalShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="page-shell max-w-3xl pb-20 pt-[112px]">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-fg-subtle">Last updated: {lastUpdated}</p>
      <div className="mt-10 space-y-10">{children}</div>
    </div>
  );
}
