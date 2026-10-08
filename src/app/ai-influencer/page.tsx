import { CTA } from "@/components/ui/CTA";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PageHero } from "@/components/ui/PageHero";
import { VideoDemo } from "@/components/ui/VideoDemo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Create AI Influencer Videos",
  description:
    "Create a consistent AI character and bring it to life with Genjutsu motion transfer.",
  path: "/ai-influencer",
  keywords: ["Create AI Influencer Videos", "Genjutsu"],
});

const flow = [
  "Create AI Character",
  "Character Identity",
  "Reference Video",
  "Motion Transfer",
  "AI Influencer Video",
];

export default function AIInfluencerPage() {
  return (
    <>
      <PageHero
        eyebrow="AI Influencer + Genjutsu"
        title="Create AI Influencer Videos"
        subtitle="Create a consistent AI character and bring it to life with motion transfer."
        ctas={[
          {
            href: "https://aiinfluencer.world",
            label: "Create Your AI Influencer",
            external: true,
          },
          {
            href: "/motion-transfer",
            label: "Try Genjutsu",
            variant: "secondary",
          },
        ]}
      />

      <section className="section-pad">
        <div className="page-shell">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-2">
            {flow.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <span
                  className={[
                    "rounded-full border px-4 py-2 text-sm",
                    step === "Motion Transfer"
                      ? "border-accent/40 bg-[rgba(216,255,62,0.08)] text-accent"
                      : "border-border bg-surface text-fg-muted",
                  ].join(" ")}
                >
                  {step}
                </span>
                {index < flow.length - 1 ? (
                  <span className="py-2 text-fg-subtle">↓</span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            <VideoDemo label="Character" tone="character" />
            <VideoDemo label="Reference" tone="reference" />
            <VideoDemo label="Influencer Video" tone="output" />
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-border bg-bg-soft">
        <div className="page-shell grid gap-4 md:grid-cols-3">
          <FeatureCard
            index="01"
            title="Identity first"
            body="Lock a consistent AI character before you introduce dance or gesture references."
          />
          <FeatureCard
            index="02"
            title="Genjutsu for motion"
            body="Use motion transfer so the influencer performs — Genjutsu stays the video engine."
          />
          <FeatureCard
            index="03"
            title="Publish-ready clips"
            body="Iterate short-form videos while keeping the same face, style and brand feel."
          />
        </div>
      </section>

      <CTA
        title="Build the character. Transfer the motion."
        body="Create on AIInfluencer.world, then bring the character into a Genjutsu workflow."
        primaryHref="https://aiinfluencer.world"
        primaryLabel="Create Your AI Influencer"
        externalPrimary
        secondaryHref="/motion-transfer"
        secondaryLabel="Motion Transfer"
      />
    </>
  );
}
