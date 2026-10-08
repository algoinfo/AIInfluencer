import Link from "next/link";
import { CoverImage } from "@/components/ui/CoverImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { styles } from "@/data/styles";

export function TrendingStyles() {
  return (
    <section className="section-pad">
      <div className="page-shell">
        <SectionHeading
          title="What's Trending"
          subtitle="Viral AI influencer styles shaping the feed."
        />
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
                  <h3 className="font-display text-xl font-medium text-white">
                    {style.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
