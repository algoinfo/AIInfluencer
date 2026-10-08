import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    id: "01",
    title: "Create Your Character",
    description:
      "Build your AI influencer from an image or from scratch.",
  },
  {
    id: "02",
    title: "Keep Your Identity",
    description:
      "Create a consistent character identity that stays recognizable across content.",
  },
  {
    id: "03",
    title: "Create Photos",
    description: "Generate new images, outfits, locations and styles.",
  },
  {
    id: "04",
    title: "Make It Move",
    description:
      "Use a reference video to create motion-driven AI influencer videos.",
    cta: true,
  },
];

export function Workflow() {
  return (
    <section className="section-pad border-y border-border bg-bg-soft">
      <div className="page-shell">
        <SectionHeading
          title="From Character to Content"
          subtitle="A clear workflow for creating, keeping consistent, and animating your AI influencer."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.id}
              className="flex flex-col rounded-[1.5rem] border border-border bg-surface p-6 transition-colors hover:bg-surface-hover"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-fg-subtle">
                {step.id}
              </p>
              <h3 className="font-display mt-4 text-xl font-medium tracking-tight">
                {step.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
                {step.description}
              </p>
              {step.cta ? (
                <div className="mt-6">
                  <Button href="/genjutsu" variant="secondary" size="md">
                    Explore Genjutsu
                  </Button>
                </div>
              ) : null}
            </article>
          ))}
        </div>

        <p className="mt-8 text-sm text-fg-muted">
          Next:{" "}
          <Link href="/create" className="text-accent hover:text-accent-strong">
            Create
          </Link>
          {" · "}
          <Link href="/video" className="text-accent hover:text-accent-strong">
            Video
          </Link>
          {" · "}
          <Link href="/soul-id" className="text-accent hover:text-accent-strong">
            Soul ID
          </Link>
        </p>
      </div>
    </section>
  );
}
