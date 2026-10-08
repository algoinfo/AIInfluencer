import type { Metadata } from "next";
import Link from "next/link";
import { CoverImage } from "@/components/ui/CoverImage";
import { styles } from "@/data/styles";

export const metadata: Metadata = {
  title: "Viral AI Influencer Styles",
  description: "Explore trending AI influencer styles for social content.",
};

export default function StylesPage() {
  return (
    <div className="page-shell pb-20 pt-[112px]">
      <div className="max-w-2xl">
        <p className="eyebrow">Styles</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          What&apos;s Trending
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          Viral AI influencer styles shaping the next wave of social content.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {styles.map((style) => (
          <Link
            key={style.slug}
            href={`/styles/${style.slug}`}
            className="group relative overflow-hidden rounded-[1.5rem] border border-border"
          >
            <div className="media-frame aspect-[4/5]">
              <CoverImage
                src={style.image}
                alt={style.name}
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h2 className="font-display text-xl font-medium text-white">
                  {style.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
