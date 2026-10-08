const steps = [
  {
    n: "01",
    title: "Choose Your Character",
    body: "Upload your character, image or AI influencer.",
  },
  {
    n: "02",
    title: "Add a Reference Video",
    body: "Choose the movement you want to transfer.",
  },
  {
    n: "03",
    title: "Generate",
    body: "AI transfers the motion to your character.",
  },
  {
    n: "04",
    title: "Create",
    body: "Get your new AI video.",
  },
];

const flow = ["Character", "Reference", "Motion Transfer", "AI Video"];

type WorkflowProps = {
  title?: string;
  compact?: boolean;
};

export function Workflow({
  title = "How It Works",
  compact = false,
}: WorkflowProps) {
  return (
    <section
      className={[
        "section-pad",
        compact ? "" : "border-t border-border bg-bg-soft",
      ].join(" ")}
    >
      <div className="page-shell">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Workflow</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h2>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-sm text-fg-muted">
          {flow.map((item, index) => (
            <div key={item} className="flex items-center gap-2">
              <span
                className={[
                  "rounded-full border px-3 py-1.5",
                  index === 2
                    ? "border-accent/40 bg-[rgba(216,255,62,0.08)] text-accent"
                    : "border-border bg-surface",
                ].join(" ")}
              >
                {item}
              </span>
              {index < flow.length - 1 ? (
                <span className="text-fg-subtle">↓</span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.n}
              className="rounded-2xl border border-border bg-surface/60 p-6 transition-colors hover:border-border-strong hover:bg-surface"
            >
              <p className="font-display text-sm tracking-[0.2em] text-accent">
                {step.n}
              </p>
              <h3 className="font-display mt-4 text-xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
