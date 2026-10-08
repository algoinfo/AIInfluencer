import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverImage } from "@/components/ui/CoverImage";
import { Button } from "@/components/ui/Button";
import { getInfluencer, influencers } from "@/data/influencers";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return influencers.map((influencer) => ({ slug: influencer.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const influencer = getInfluencer(slug);
  if (!influencer) return {};
  return pageMetadata({
    title: `${influencer.name} — ${influencer.type}`,
    description: `Explore ${influencer.name}, an AI ${influencer.type.toLowerCase()} for social content and Genjutsu video.`,
    path: `/influencers/${slug}`,
    keywords: [
      influencer.name,
      "AI influencer",
      influencer.type,
      "Genjutsu character",
    ],
  });
}

export default async function InfluencerDetailPage({ params }: Props) {
  const { slug } = await params;
  const influencer = getInfluencer(slug);
  if (!influencer) notFound();

  return (
    <div className="page-shell grid gap-10 pb-20 pt-[112px] lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div className="media-frame aspect-[3/4] overflow-hidden rounded-[1.75rem] border border-border">
        <CoverImage src={influencer.image} alt={influencer.name} priority />
      </div>
      <div>
        <Link
          href="/discover"
          className="text-sm text-fg-muted transition hover:text-fg"
        >
          ← Discover
        </Link>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {influencer.name}
        </h1>
        <p className="mt-3 text-lg text-fg-muted">{influencer.type}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {influencer.platforms.map((platform) => (
            <span
              key={platform}
              className="rounded-full border border-border px-3 py-1 text-sm text-fg-muted"
            >
              {platform}
            </span>
          ))}
        </div>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted">
          A mock creator profile for the AIInfluencer platform. Use this look as
          inspiration, then create your own character with a consistent identity
          across photos, videos and social posts.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/create">Create Similar Influencer</Button>
          <Button href="/video" variant="secondary">
            Create Video
          </Button>
          <Button href="/genjutsu" variant="ghost">
            Explore Genjutsu
          </Button>
        </div>
      </div>
    </div>
  );
}
