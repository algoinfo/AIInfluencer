import Link from "next/link";
import { GuideCard } from "@/components/ui/GuideCard";
import { PageHero } from "@/components/ui/PageHero";
import { guides } from "@/data/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Genjutsu Guides — Motion Transfer How-Tos",
  description:
    "Genjutsu guides: what the studio can do, how to run motion transfer, create AI influencer videos, and lock consistent characters.",
  path: "/guides",
  keywords: [
    "Genjutsu Guides",
    "what can Genjutsu do",
    "AI motion transfer tutorial",
    "AI influencer video guide",
  ],
});

const useCases = [
  { href: "/ugc-video-generator", label: "AI UGC video generator" },
  { href: "/dance-video", label: "AI dance video" },
  { href: "/ai-pet-dance", label: "AI pet dance" },
  { href: "/avatar-video-generator", label: "Avatar video generator" },
  { href: "/ai-influencer", label: "AI influencer" },
  { href: "/product-video", label: "Product video" },
  { href: "/motion-transfer", label: "Motion transfer (support)" },
  { href: "/genjutsu-alternatives", label: "Tool alternatives" },
];

export default function GuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="Editorial hub"
        title="Genjutsu Guides"
        subtitle="Start with what Genjutsu can do, then deep how-tos for the studio, influencers, and consistent characters."
        ctas={[
          { href: "/#studio", label: "Open studio" },
          {
            href: "/guides/what-can-genjutsu-do",
            label: "What Genjutsu can do",
            variant: "secondary",
          },
        ]}
      />

      <section className="section-pad pt-0 sm:pt-2">
        <div className="page-shell max-w-3xl">
          <p className="text-base leading-relaxed text-fg-muted">
            Older one-paragraph “guides” (what-is stubs and vs-pages) redirect to
            product or comparison URLs so Google is not asked to rank empty
            shells. For jobs like dance, UGC, and product clips, use the
            use-case pages below.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {useCases.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border px-3 py-1.5 text-fg-muted transition hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-10 divide-y divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 sm:px-6">
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
