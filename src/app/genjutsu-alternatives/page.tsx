import { PageHero } from "@/components/ui/PageHero";
import { ToolCard } from "@/components/ui/ToolCard";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Best Genjutsu Alternatives — Kling, Runway, Veo",
  description:
    "Compare Genjutsu with Kling, Runway, Veo, Seedance and other AI video tools for motion transfer and character workflows.",
  path: "/genjutsu-alternatives",
  keywords: [
    "Genjutsu alternatives",
    "Kling vs Genjutsu",
    "AI video comparison",
    "motion transfer tools",
  ],
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
    href: "/genjutsu-alternatives",
  },
  {
    name: "Runway",
    focus: "Creative video suite",
    best: "Editorial generation + tools",
    href: "/genjutsu-alternatives",
  },
  {
    name: "Veo",
    focus: "High-fidelity video models",
    best: "Polished cinematic clips",
    href: "/genjutsu-alternatives",
  },
  {
    name: "Seedance",
    focus: "Dance / body motion",
    best: "Performance-heavy shorts",
    href: "/genjutsu-alternatives",
  },
  {
    name: "Higgsfield",
    focus: "Cinematic AI video platform",
    best: "Broader video + Genjutsu-like flows",
    href: "/genjutsu",
  },
];

const cards = [
  {
    name: "Kling",
    description: "Strong generative motion when you do not have a strict reference.",
    category: "Video Generation",
    href: "/dance-video",
    initial: "K",
  },
  {
    name: "Runway",
    description: "Broad creative toolkit beyond pure motion transfer.",
    category: "Video Generation",
    href: "/motion-transfer",
    initial: "R",
  },
  {
    name: "Veo",
    description: "High-quality video generation for polished outputs.",
    category: "Video Generation",
    href: "/genjutsu-alternatives",
    initial: "V",
  },
  {
    name: "Seedance",
    description: "Motion-first generation for dance and performance.",
    category: "Motion Transfer",
    href: "/genjutsu-alternatives",
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
