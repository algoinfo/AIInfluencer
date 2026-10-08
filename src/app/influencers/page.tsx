import type { Metadata } from "next";
import { InfluencerCard } from "@/components/influencers/InfluencerCard";
import { influencers } from "@/data/influencers";

export const metadata: Metadata = {
  title: "AI Influencers",
  description: "Browse AI influencers, digital models and virtual creators.",
};

export default function InfluencersPage() {
  return (
    <div className="page-shell pb-20 pt-[112px]">
      <div className="max-w-2xl">
        <p className="eyebrow">Creators</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          AI Influencers
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          Characters and digital creators ready to explore and remix.
        </p>
      </div>
      <div className="masonry mt-10">
        {influencers.map((influencer) => (
          <InfluencerCard key={influencer.slug} influencer={influencer} />
        ))}
      </div>
    </div>
  );
}
