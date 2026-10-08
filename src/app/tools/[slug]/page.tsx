import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getTool, tools } from "@/data/tools";
import { SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical: `${SITE_URL}/tools/${slug}` },
    openGraph: {
      title: tool.name,
      description: tool.description,
      url: `${SITE_URL}/tools/${slug}`,
    },
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const isExternalInfluencer = tool.slug === "aiinfluencer-world";
  const isGenjutsu = tool.slug === "genjutsu";

  return (
    <div className="page-shell pb-20 pt-[112px]">
      <Link href="/tools" className="text-sm text-fg-muted transition hover:text-fg">
        ← All tools
      </Link>
      <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface font-display text-2xl text-accent">
        {tool.initial}
      </div>
      <p className="eyebrow mt-6">{tool.category}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        {tool.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">{tool.description}</p>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted">
        {isGenjutsu
          ? "Genjutsu on this site means AI video motion transfer: character + reference video → generated AI video. Explore the demo and guides to learn the workflow."
          : isExternalInfluencer
            ? "AIInfluencer.world is a companion for building consistent AI characters. Use it for identity, then bring the character into a Genjutsu motion workflow."
            : "Place this tool in the Genjutsu pipeline where it fits — character stills, video generation, or motion transfer — rather than treating it as a random directory listing."}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {isExternalInfluencer ? (
          <Button href="https://aiinfluencer.world" external>
            Open AIInfluencer.world
          </Button>
        ) : (
          <Button href="/motion-transfer">Try Genjutsu</Button>
        )}
        <Button href="/genjutsu" variant="secondary">
          What is Genjutsu?
        </Button>
      </div>
    </div>
  );
}
