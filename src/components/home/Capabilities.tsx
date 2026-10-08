import { SectionHeading } from "@/components/ui/SectionHeading";
import { capabilities } from "@/data/create";

export function Capabilities() {
  return (
    <section className="section-pad">
      <div className="page-shell">
        <SectionHeading
          title="More Than a Character"
          subtitle="Create photos, videos and motion while keeping identity consistent."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item, index) => (
            <article
              key={item.title}
              className="rounded-[1.5rem] border border-border bg-surface p-6 transition-colors duration-300 hover:bg-surface-hover sm:p-7"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-fg-subtle">
                0{index + 1}
              </p>
              <h3 className="font-display mt-4 text-2xl font-medium tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted sm:text-base">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
