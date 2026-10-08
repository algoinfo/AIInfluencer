import { VideoDemo } from "@/components/ui/VideoDemo";

export function BeforeAfter() {
  return (
    <section className="section-pad border-t border-border">
      <div className="page-shell">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Core Demo</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            One Video. Any Character.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            Keep the performance. Swap the character. Genjutsu maps motion from
            a reference clip onto your subject.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <VideoDemo
            label="Character"
            caption="Your character"
            tone="character"
          />

          <FlowMark label="+" className="hidden md:flex" />
          <FlowMark label="+" className="flex md:hidden justify-center py-1" />

          <VideoDemo
            label="Reference"
            caption="Reference video"
            tone="reference"
          />

          <div className="hidden flex-col items-center gap-2 px-1 md:flex">
            <span className="text-[0.65rem] uppercase tracking-[0.18em] text-accent">
              Motion
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.18em] text-accent">
              Transfer
            </span>
            <div className="flow-beam h-16 w-px bg-border-strong" />
          </div>
          <div className="flex items-center justify-center py-2 md:hidden">
            <span className="rounded-full border border-accent/30 bg-[rgba(216,255,62,0.08)] px-4 py-2 text-[0.7rem] uppercase tracking-[0.18em] text-accent">
              Motion Transfer
            </span>
          </div>

          <VideoDemo
            label="Result"
            caption="Generated AI video"
            tone="output"
          />
        </div>
      </div>
    </section>
  );
}

function FlowMark({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "items-center justify-center text-2xl font-light text-fg-subtle",
        className,
      ].join(" ")}
    >
      {label}
    </div>
  );
}
