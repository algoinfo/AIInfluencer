import { PageHero } from "@/components/ui/PageHero";
import { ToolCard } from "@/components/ui/ToolCard";
import { toolCategories, tools } from "@/data/tools";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tools for Genjutsu Workflows",
  description:
    "Curated character, image, video, motion transfer and AI influencer tools that fit the Genjutsu pipeline.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Curated"
        title="Tools"
        subtitle="Not a dump of every AI app — only tools that fit character creation, motion transfer and AI video."
      />

      <section className="section-pad">
        <div className="page-shell space-y-14">
          {toolCategories.map((category) => {
            const items = tools.filter((tool) => tool.category === category);
            if (!items.length) return null;
            return (
              <div key={category}>
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  {category}
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((tool) => (
                    <ToolCard
                      key={tool.slug}
                      name={tool.name}
                      description={tool.description}
                      category={tool.category}
                      href={`/tools/${tool.slug}`}
                      initial={tool.initial}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
