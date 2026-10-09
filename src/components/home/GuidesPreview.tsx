import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { guides } from "@/data/guides";

export function GuidesPreview() {
  return (
    <section className="section-pad border-y border-border bg-bg-soft">
      <div className="page-shell">
        <SectionHeading
          title="Learn Genjutsu workflows"
          subtitle="Deep how-tos for studio use, influencer batches, and identity locks."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-[1.35rem] border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-fg-subtle">
                {guide.readTime} read
              </p>
              <h3 className="font-display mt-3 text-xl font-medium leading-snug">
                {guide.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {guide.excerpt}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/guides" className="text-accent hover:text-accent-strong">
            All guides →
          </Link>
          <Link href="/dance-video" className="text-accent hover:text-accent-strong">
            Dance video →
          </Link>
          <Link
            href="/ugc-video-generator"
            className="text-accent hover:text-accent-strong"
          >
            UGC generator →
          </Link>
        </div>
      </div>
    </section>
  );
}
