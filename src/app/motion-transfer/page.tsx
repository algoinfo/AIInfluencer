import Link from "next/link";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { MotionTransferDemo } from "@/components/ui/MotionTransferDemo";
import { PageHero } from "@/components/ui/PageHero";
import { CTA } from "@/components/ui/CTA";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Motion Transfer – Turn Images Into Videos | Genjutsu",
  description:
    "Transform a character, product, or image using motion from a reference video with AI motion transfer. Create AI influencer videos, product videos, dance videos, and more.",
  path: "/motion-transfer",
  absoluteTitle: true,
  keywords: [
    "AI motion transfer",
    "motion control video",
    "character motion transfer",
    "reference video AI",
  ],
});

const concepts = [
  {
    title: "What is Motion Transfer?",
    body: "Motion transfer maps movement from a reference video onto your character so the performance stays, while the subject changes.",
  },
  {
    title: "Reference Video",
    body: "The motion source — dance, walk, gesture or camera-aware action you want to reuse.",
  },
  {
    title: "Character",
    body: "Your subject: a photo, illustrated character or consistent AI influencer identity.",
  },
  {
    title: "Movement",
    body: "Body timing, pose transitions and energy inherited from the reference clip.",
  },
  {
    title: "Camera Motion",
    body: "Framing and camera feel can travel with the reference, depending on the model.",
  },
  {
    title: "Generated Video",
    body: "The output AI video where your character performs the transferred motion.",
  },
];

export default function MotionTransferPage() {
  return (
    <>
      <PageHero
        eyebrow="Genjutsu"
        title="AI Motion Transfer"
        subtitle="Bring any character to life with the movement of a reference video."
        tags={["Character", "Reference Video", "AI Video"]}
        ctas={[
          { href: "/#studio", label: "Open studio" },
          { href: "/examples", label: "See Examples", variant: "secondary" },
        ]}
      />

      <section className="section-pad">
        <div className="page-shell">
          <div className="mb-8 max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Interactive demo
            </h2>
            <p className="mt-3 text-fg-muted">
              Explore the upload layout here, then generate for real in the{" "}
              <Link href="/#studio" className="text-fg underline-offset-2 hover:underline">
                homepage studio
              </Link>
              .
            </p>
          </div>
          <MotionTransferDemo />
        </div>
      </section>

      <section className="section-pad border-t border-border bg-bg-soft">
        <div className="page-shell">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            The building blocks
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {concepts.map((item, index) => (
              <FeatureCard
                key={item.title}
                title={item.title}
                body={item.body}
                index={String(index + 1).padStart(2, "0")}
              />
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="See what motion transfer can create"
        body="Browse examples, or generate AI influencer and product clips in the studio."
        primaryHref="/#studio"
        primaryLabel="Open studio"
        secondaryHref="/examples"
        secondaryLabel="Open Examples"
      />
    </>
  );
}
