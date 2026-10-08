import Link from "next/link";
import { SeoPageShell } from "@/components/seo/SeoPageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Influencer Video Generator — Create AI Character Videos",
  description:
    "Create videos with your AI influencer using reference images, characters and motion transfer.",
  path: "/ai-influencer-video",
});

export default function AIInfluencerVideoPage() {
  return (
    <SeoPageShell
      eyebrow="AI Influencer Video"
      title="AI Influencer Video Generator"
      subtitle="Create videos with your AI influencer using reference images, characters and motion transfer."
      ctas={[
        { href: "/video", label: "Create Video" },
        { href: "/genjutsu", label: "Explore Genjutsu", variant: "secondary" },
      ]}
    >
      <div className="rounded-[1.5rem] border border-border bg-surface p-6 sm:p-8">
        <h2 className="font-display text-2xl font-medium">How it works</h2>
        <ol className="mt-5 space-y-3 text-base leading-relaxed text-fg-muted">
          <li>1. Select or create your AI character</li>
          <li>2. Upload a reference video for motion</li>
          <li>3. Run motion transfer to generate an AI influencer video</li>
        </ol>
        <p className="mt-6 text-sm text-fg-muted">
          Learn the motion workflow in{" "}
          <Link href="/genjutsu" className="text-accent hover:text-accent-strong">
            Higgsfield Genjutsu
          </Link>{" "}
          or jump into the{" "}
          <Link href="/video" className="text-accent hover:text-accent-strong">
            Video studio
          </Link>
          .
        </p>
      </div>
    </SeoPageShell>
  );
}
