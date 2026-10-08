import { InfluencerCard } from "@/components/influencers/InfluencerCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { influencers } from "@/data/influencers";

export function TrendingInfluencers() {
  return (
    <section className="section-pad">
      <div className="page-shell">
        <SectionHeading
          title="Trending AI Influencers"
          subtitle="Discover creators, characters and styles shaping the next generation of social media."
        />
        <div className="masonry mt-10">
          {influencers.map((influencer) => (
            <InfluencerCard key={influencer.slug} influencer={influencer} />
          ))}
        </div>
      </div>
    </section>
  );
}
