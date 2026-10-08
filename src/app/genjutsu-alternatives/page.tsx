import { PageHero } from "@/components/ui/PageHero";
import { ToolCard } from "@/components/ui/ToolCard";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Best Genjutsu Alternatives",
  description:
    "Compare Genjutsu with Kling, Runway, Veo, Seedance and other AI video tools for motion and character workflows.",
  path: "/genjutsu-alternatives",
});

const rows = [
  {
    name: "Genjutsu",
    focus: "Reference-driven motion transfer",
    best: "Character performance from a clip",
    href: "/genjutsu",
  },
  {
    name: "Kling",
    focus: "Generative AI video",
    best: "Prompt / image to video motion",
    href: "/tools/kling",
  },
  {
    name: "Runway",
    focus: "Creative video suite",
    best: "Editorial generation + tools",
    href: "/tools/runway",
  },
  {
    name: "Veo",
    focus: "High-fidelity video models",
    best: "Polished cinematic clips",
    href: "/tools/veo",
  },
  {
    name: "Seedance",
    focus: "Dance / body motion",
    best: "Performance-heavy shorts",
    href: "/tools/seedance",
  },
  {
    name: "Higgsfield",
    focus: "Cinematic AI video platform",
    best: "Broader video + Genjutsu-like flows",
    href: "/tools/higgsfield",
  },
];

const cards = [
  {
    name: "Kling",
    description: "Strong generative motion when you do not have a strict reference.",
    category: "Video Generation",
    href: "/tools/kling",
    initial: "K",
  },
  {
    name: "Runway",
    description: "Broad creative toolkit beyond pure motion transfer.",
    category: "Video Generation",
    href: "/tools/runway",
    initial: "R",
  },
  {
    name: "Veo",
    description: "High-quality video generation for polished outputs.",
    category: "Video Generation",
    href: "/tools/veo",
    initial: "V",
  },
  {
    name: "Seedance",
    description: "Motion-first generation for dance and performance.",
    category: "Motion Transfer",
    href: "/tools/seedance",
    initial: "S",
  },
];

export default function GenjutsuAlternativesPage() {
  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Best Genjutsu Alternatives"
        subtitle="Use this page to choose between reference-driven motion transfer and broader AI video tools."
      />

      <section className="section-pad">
        <div className="page-shell">
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface text-fg-subtle">
                <tr>
                  <th className="px-4 py-3 font-medium">Tool</th>
                  <th className="px-4 py-3 font-medium">Focus</th>
                  <th className="px-4 py-3 font-medium">Best for</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.name} className="border-t border-border">
                    <td className="px-4 py-3">
                      <a href={row.href} className="text-fg hover:text-accent">
                        {row.name}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-fg-muted">{row.focus}</td>
                    <td className="px-4 py-3 text-fg-muted">{row.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-display mt-14 text-2xl font-semibold tracking-tight">
            Related tools
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <ToolCard key={card.name} {...card} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
