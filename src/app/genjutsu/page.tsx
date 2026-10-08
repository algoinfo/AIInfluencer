import { CTA } from "@/components/ui/CTA";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PageHero } from "@/components/ui/PageHero";
import { Workflow } from "@/components/ui/Workflow";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "What is Genjutsu AI — Motion Transfer Explained",
  description:
    "Genjutsu AI is motion transfer for characters and creators: character + reference video → AI video. Learn how it works and how it relates to Higgsfield Genjutsu.",
  path: "/genjutsu",
  keywords: [
    "what is Genjutsu",
    "Genjutsu AI",
    "Higgsfield Genjutsu",
    "AI motion transfer explained",
  ],
});

const sections = [
  {
    title: "What is Genjutsu?",
    body: "Genjutsu is an AI video motion transfer approach: you take a character and a reference video, then generate a new clip where your character performs that motion. On genjutsu.online, Genjutsu is the product concept and education hub — not a generic AI directory.",
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
    title: "Genjutsu and Higgsfield",
    body: "Genjutsu-style motion workflows are associated with platforms such as Higgsfield. This website — genjutsu.online — is an independent educational and product site about AI motion transfer. It is not the official Higgsfield website and is not affiliated with Higgsfield.",
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
          { href: "/motion-transfer", label: "Try Genjutsu" },
          {
            href: "/genjutsu-tutorial",
            label: "Tutorial",
            variant: "secondary",
          },
        ]}
      >
        <div className="rounded-2xl border border-border bg-surface/60 px-5 py-4 text-sm leading-relaxed text-fg-muted">
          Independent site about Genjutsu / AI motion transfer. Not affiliated
          with Higgsfield or any official platform brand.
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
        body="Open the demo, browse examples, or read the step-by-step tutorial."
        primaryHref="/motion-transfer"
        primaryLabel="Try Genjutsu"
        secondaryHref="/genjutsu-alternatives"
        secondaryLabel="See Alternatives"
      />
    </>
  );
}
