import { GuideCard } from "@/components/ui/GuideCard";
import { PageHero } from "@/components/ui/PageHero";
import { guides } from "@/data/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Genjutsu Guides",
  description:
    "Editorial guides on Genjutsu, AI motion transfer, tutorials, comparisons and consistent AI characters.",
  path: "/guides",
  keywords: ["Genjutsu Guides", "Genjutsu"],
});

export default function GuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="Editorial"
        title="Genjutsu Guides"
        subtitle="Deep dives on motion transfer, Genjutsu workflows and AI influencer video — magazine layout, not a blog dump."
      />

      <section className="section-pad pt-0 sm:pt-2">
        <div className="page-shell max-w-3xl">
          <div className="divide-y divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 sm:px-6">
            {guides.map((guide, index) => (
              <GuideCard
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                title={guide.title}
                excerpt={guide.excerpt}
                readTime={guide.readTime}
                index={String(index + 1).padStart(2, "0")}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
