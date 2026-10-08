import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverImage } from "@/components/ui/CoverImage";
import { Button } from "@/components/ui/Button";
import { getStyle, styles } from "@/data/styles";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return styles.map((style) => ({ slug: style.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const style = getStyle(slug);
  if (!style) return {};
  return {
    title: style.name,
    description: style.description,
  };
}

export default async function StyleDetailPage({ params }: Props) {
  const { slug } = await params;
  const style = getStyle(slug);
  if (!style) notFound();

  return (
    <div className="pb-20 pt-[72px]">
      <div className="media-frame relative h-[420px] w-full sm:h-[520px]">
        <CoverImage src={style.image} alt={style.name} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <div className="page-shell absolute inset-x-0 bottom-0 pb-10">
          <Link
            href="/styles"
            className="text-sm text-fg-muted transition hover:text-fg"
          >
            ← All styles
          </Link>
          <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            {style.name}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-fg-muted">{style.description}</p>
          <div className="mt-6">
            <Button href={`/create?style=${encodeURIComponent(style.name.replace("AI ", ""))}`}>
              Create in this style
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
