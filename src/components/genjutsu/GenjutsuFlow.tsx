import { CoverImage } from "@/components/ui/CoverImage";

const stages = [
  { label: "Your AI Influencer", image: "/images/mia.jpg", caption: "Mia" },
  {
    label: "Character Identity",
    image: "/images/mia.jpg",
    caption: "Consistent look",
  },
  {
    label: "Reference Video",
    image: "/images/elise.jpg",
    caption: "Dance motion",
  },
  {
    label: "Motion Transfer",
    image: "/images/nova.jpg",
    caption: "Apply motion",
  },
  {
    label: "AI Influencer Video",
    image: "/images/mia.jpg",
    caption: "Mia performing",
  },
];

export function GenjutsuFlow() {
  return (
    <section className="rounded-[1.75rem] border border-border bg-bg-soft p-6 sm:p-8">
      <p className="eyebrow">Visual workflow</p>
      <h2 className="font-display mt-3 text-2xl font-medium sm:text-3xl">
        Mia + Dance Video → Mia performing the same motion
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stages.map((stage, index) => (
          <div key={stage.label} className="relative">
            <div className="media-frame aspect-[3/4] overflow-hidden rounded-2xl border border-border">
              <CoverImage src={stage.image} alt={stage.label} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/70">
                  0{index + 1}
                </p>
                <p className="mt-1 font-medium text-white">{stage.label}</p>
                <p className="text-xs text-white/70">{stage.caption}</p>
              </div>
            </div>
            {index < stages.length - 1 ? (
              <p className="mt-2 text-center text-xs text-fg-subtle lg:absolute lg:-right-2 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2">
                ↓
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
