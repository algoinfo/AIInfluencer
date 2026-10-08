import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredTools } from "@/data/tools";

export function ToolsPreview() {
  return (
    <section className="section-pad border-y border-border bg-bg-soft">
      <div className="page-shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="AI Influencer Tools"
            subtitle="Use tools after you have a character — image, video, motion and avatars."
          />
          <Button href="/tools" variant="secondary">
            Explore All Tools
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group rounded-[1.35rem] border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-bg font-display text-lg text-accent">
                {tool.initial}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-medium">{tool.name}</h3>
                <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-fg-subtle">
                  {tool.category}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {tool.description}
              </p>
              <span className="mt-4 inline-flex text-sm text-accent transition group-hover:text-accent-strong">
                Explore
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
