import { CTA } from "@/components/ui/CTA";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How to Use Genjutsu — Step-by-Step Tutorial",
  description:
    "Practical Genjutsu tutorial: create your character, prepare a reference video, configure motion transfer or object swap, and improve results.",
  path: "/genjutsu-tutorial",
  keywords: [
    "Genjutsu tutorial",
    "how to use Genjutsu",
    "motion transfer tutorial",
    "AI video tutorial",
  ],
});

const steps = [
  {
    title: "Create your character",
    body: "Start with a clear subject — photo, illustrated character or AI influencer identity. Collect a few consistent stills if you need the same face across clips.",
    media: "Screenshot / character sheet placeholder",
  },
  {
    title: "Prepare a reference video",
    body: "Choose the exact movement you want. Prefer readable full-body motion, stable framing and a length that matches your target clip.",
    media: "Reference video placeholder",
  },
  {
    title: "Upload your assets",
    body: "Add the character and reference into a Genjutsu-style workflow. Keep filenames and versions organized so you can iterate quickly.",
    media: "Upload UI placeholder",
  },
  {
    title: "Configure the generation",
    body: "Set duration, framing and any identity-strength controls your tool exposes. Smaller, clearer settings beat vague one-shot prompts.",
    media: "Settings panel placeholder",
  },
  {
    title: "Generate",
    body: "Run motion transfer and review the first pass for identity hold, limb artifacts and camera feel before you publish.",
    media: "Generate progress placeholder",
  },
  {
    title: "Improve the result",
    body: "Swap to a cleaner reference crop, adjust camera height match, or regenerate with tighter character stills. Change one variable at a time.",
    media: "Before / after placeholder",
  },
  {
    title: "Create consistent videos",
    body: "Reuse the same character package across clips. Vary only the reference performance so your AI influencer or character stays recognizable.",
    media: "Series of output clips placeholder",
  },
];

export default function GenjutsuTutorialPage() {
  return (
    <>
      <PageHero
        eyebrow="Tutorial"
        title="How to Use Genjutsu"
        subtitle="A practical walkthrough from character prep to consistent AI videos."
        ctas={[
          { href: "/motion-transfer", label: "Open Demo" },
          { href: "/examples", label: "See Examples", variant: "secondary" },
        ]}
      />

      <section className="section-pad">
        <div className="page-shell space-y-8">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="grid gap-6 border-t border-border py-10 first:border-t-0 lg:grid-cols-[1fr_0.9fr] lg:items-center"
            >
              <div>
                <p className="font-display text-sm tracking-[0.2em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {step.title}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
                  {step.body}
                </p>
              </div>
              <div className="media-frame film-grain flex aspect-video items-center justify-center rounded-2xl video-shimmer">
                <p className="px-6 text-center text-sm text-fg-subtle">
                  {step.media}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CTA
        title="Practice the workflow"
        body="Use the interactive demo to rehearse Character + Reference → Motion Transfer."
        primaryHref="/motion-transfer"
        primaryLabel="Try Genjutsu"
        secondaryHref="/guides"
        secondaryLabel="More Guides"
      />
    </>
  );
}
