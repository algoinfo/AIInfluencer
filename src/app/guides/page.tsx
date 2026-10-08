import { GuideCard } from "@/components/ui/GuideCard";
import { PageHero } from "@/components/ui/PageHero";
import { guides } from "@/data/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Genjutsu Guides",
  description:
    "Editorial guides on Genjutsu, AI motion transfer, tutorials, comparisons and consistent AI characters.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="Editorial"
        title="Genjutsu Guides"
        subtitle="Deep dives on motion transfer, Genjutsu workflows and AI influencer video — magazine layout, not a blog dump."
      />

      <section className="section-pad">
        <div className="page-shell">
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
      </section>
    </>
  );
}
