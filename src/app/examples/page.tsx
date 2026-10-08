import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { motionLibraryClips } from "@/data/motion-library";

export default function ExamplesPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Motion Library"
        subtitle="Motion transfer looks — the same clips featured in the Genjutsu studio."
        tags={motionLibraryClips.map((clip) => clip.label)}
        ctas={[
          { href: "/#studio", label: "Open studio" },
          { href: "/pricing", label: "Pricing", variant: "secondary" },
        ]}
      />

      <section className="section-pad">
        <div className="page-shell">
          <div className="grid gap-4 sm:grid-cols-3">
            {motionLibraryClips.map((clip) => (
              <Link
                key={clip.id}
                href="/#studio"
                className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <Image
                  src={clip.src}
                  alt={clip.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <p className="absolute bottom-3 left-3 text-sm font-medium text-fg">
                  {clip.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
