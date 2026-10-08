import { SeoPageShell } from "@/components/seo/SeoPageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Influencer Generator — Create Your AI Influencer",
  description:
    "Create a consistent AI influencer from a photo or a description. Build character identity for photos and videos.",
  path: "/ai-influencer-generator",
  keywords: ["AI Influencer Generator — Create Your AI Influencer", "Genjutsu"],
});

export default function AIInfluencerGeneratorPage() {
  return (
    <SeoPageShell
      eyebrow="AI Influencer Generator"
      title="AI Influencer Generator"
      subtitle="Create a consistent AI influencer from a photo or a description."
      ctas={[{ href: "/create", label: "Create Your Influencer" }]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "From a photo",
            body: "Upload a reference image and lock the look into a character sheet.",
          },
          {
            title: "From a description",
            body: "Generate a character with looks, style, personality and niche.",
          },
          {
            title: "Stay consistent",
            body: "Save Character Identity so new photos and videos stay on-model.",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-[1.35rem] border border-border bg-surface p-6"
          >
            <h2 className="font-display text-xl font-medium">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </SeoPageShell>
  );
}
