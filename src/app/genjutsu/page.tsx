import { CTA } from "@/components/ui/CTA";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PageHero } from "@/components/ui/PageHero";
import { Workflow } from "@/components/ui/Workflow";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "What is Genjutsu AI — Motion Transfer Explained",
  description:
    "Genjutsu AI is motion transfer for characters and creators: character image + reference video → AI video. Learn the workflow and open the studio on genjutsu.online.",
  path: "/genjutsu",
  keywords: [
    "what is Genjutsu",
    "Genjutsu AI",
    "AI motion transfer explained",
    "character motion transfer",
  ],
});

const sections = [
  {
    title: "What is Genjutsu?",
    body: "Genjutsu is an AI video tool for motion transfer: upload a character still and a reference clip, then generate a new video where your subject performs that motion. On genjutsu.online you can learn the workflow and run it in the studio.",
  },
  {
    title: "How Genjutsu works",
    body: "Choose a character, add a reference video, run motion transfer, and create an AI video. The reference controls performance; the character controls identity.",
  },
  {
    title: "Motion Transfer",
    body: "Motion transfer is the core step. Timing, pose and movement energy move from the reference onto your subject.",
  },
  {
    title: "Object Swap",
    body: "Related workflows can swap subjects or objects while keeping motion structure — useful for products and stylized characters.",
  },
  {
    title: "Restyle",
    body: "Restyle changes look and aesthetic while aiming to preserve motion. Pair it with motion transfer when you need a new visual world around the same performance.",
  },
  {
    title: "AI Influencer",
    body: "AI influencers are consistent characters. Genjutsu brings them to life with reference-driven motion after identity is locked.",
  },
  {
    title: "Character Animation",
    body: "Still characters become animated performances without hand-keyframing every frame — ideal for short-form content.",
  },
  {
    title: "Reference Videos",
    body: "Pick clean clips with readable movement. Full-body dance, walks and gestures usually transfer more clearly than chaotic handheld footage.",
  },
  {
    title: "Genjutsu workflow",
    body: "Character → Reference → Motion Transfer → AI Video. Keep iterating the reference and identity package until the result feels on-model.",
  },
  {
    title: "What you can do here",
    body: "Open the studio to generate clips, browse examples for still + motion pairs, follow the tutorial for best practices, and pick credit packs when you are ready to produce more.",
  },
  {
    title: "Genjutsu alternatives",
    body: "Compare Kling, Runway, Veo, Seedance and other AI video tools when you need different motion or generation styles.",
  },
];

export default function GenjutsuPage() {
  return (
    <>
      <PageHero
        eyebrow="Genjutsu AI"
        title="Genjutsu AI"
        subtitle="AI-powered motion transfer for characters, creators and videos."
        tags={["Motion Transfer", "AI Video", "Character Animation"]}
        ctas={[
          { href: "/#studio", label: "Open studio" },
          {
            href: "/genjutsu-tutorial",
            label: "Tutorial",
            variant: "secondary",
          },
        ]}
      >
        <div className="rounded-2xl border border-border bg-surface/60 px-5 py-4 text-sm leading-relaxed text-fg-muted">
          Character image + reference video → motion transfer → downloadable
          MP4. Built for creators who want controlled movement without
          keyframing every frame.
        </div>
      </PageHero>

      <Workflow title="Genjutsu workflow" compact />

      <section className="section-pad border-t border-border">
        <div className="page-shell grid gap-4 md:grid-cols-2">
          {sections.map((section, index) => (
            <FeatureCard
              key={section.title}
              title={section.title}
              body={section.body}
              index={String(index + 1).padStart(2, "0")}
            />
          ))}
        </div>
      </section>

      <CTA
        title="Start with motion transfer"
        body="Open the studio, browse examples, or read the step-by-step tutorial."
        primaryHref="/#studio"
        primaryLabel="Open studio"
        secondaryHref="/examples"
        secondaryLabel="See examples"
      />
    </>
  );
}
