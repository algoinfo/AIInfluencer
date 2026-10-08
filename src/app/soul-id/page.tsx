import Link from "next/link";
import { SeoPageShell } from "@/components/seo/SeoPageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Higgsfield Soul ID: Consistent AI Character Guide",
  description:
    "Soul ID helps maintain the identity of an AI character across generated content. Learn character sheet, reference images and consistent AI characters.",
  path: "/soul-id",
});

export default function SoulIdPage() {
  return (
    <SeoPageShell
      eyebrow="Identity"
      title="Soul ID"
      subtitle="Soul ID helps maintain the identity of an AI character across generated content."
      ctas={[
        { href: "/create", label: "Create Your Influencer" },
        { href: "/genjutsu", label: "Explore Genjutsu", variant: "secondary" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Character Sheet", body: "Looks, style, niche, signature." },
          { title: "Soul ID", body: "Identity lock across generations." },
          { title: "Reference Images", body: "Visual anchors for recognition." },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-[1.35rem] border border-border bg-surface p-6"
          >
            <h2 className="font-display text-xl font-medium">{item.title}</h2>
            <p className="mt-2 text-sm text-fg-muted">{item.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-border bg-bg-soft p-6 sm:p-8">
        <p className="font-display text-2xl font-medium tracking-tight">
          Character Sheet + Soul ID + Reference Images = Consistent AI Character
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted">
          Consistency is what turns a one-off AI image into an AI influencer.
          Build the sheet in{" "}
          <Link href="/create" className="text-accent hover:text-accent-strong">
            Create
          </Link>
          , then animate with{" "}
          <Link href="/genjutsu" className="text-accent hover:text-accent-strong">
            Higgsfield Genjutsu
          </Link>{" "}
          or the{" "}
          <Link href="/video" className="text-accent hover:text-accent-strong">
            Video
          </Link>{" "}
          studio.
        </p>
      </div>
    </SeoPageShell>
  );
}
