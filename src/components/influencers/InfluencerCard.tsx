import Link from "next/link";
import { CoverImage } from "@/components/ui/CoverImage";
import type { Influencer } from "@/data/influencers";

const heightClass = {
  tall: "aspect-[3/4.4]",
  medium: "aspect-[3/3.7]",
  short: "aspect-[3/3.2]",
};

export function InfluencerCard({ influencer }: { influencer: Influencer }) {
  return (
    <Link
      href={`/influencers/${influencer.slug}`}
      className="masonry-item group relative block overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <div className={`media-frame ${heightClass[influencer.height]}`}>
        <CoverImage
          src={influencer.image}
          alt={influencer.name}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-display text-lg font-medium text-white">
            {influencer.name}
          </p>
          <p className="mt-0.5 text-sm text-white/75">{influencer.type}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {influencer.platforms.map((platform) => (
              <span
                key={platform}
                className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] text-white/85"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="rounded-full border border-white/20 bg-black/45 px-4 py-2 text-sm text-white backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            View Creator
          </span>
        </div>
      </div>
    </Link>
  );
}
