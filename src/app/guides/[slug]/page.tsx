import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getGuide, guides } from "@/data/guides";
import { SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: { canonical: `${SITE_URL}/guides/${slug}` },
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      url: `${SITE_URL}/guides/${slug}`,
    },
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <article className="page-shell pb-20 pt-[112px]">
      <Link
        href="/guides"
        className="text-sm text-fg-muted transition hover:text-fg"
      >
        ← All guides
      </Link>
      <p className="eyebrow mt-8">{guide.readTime} read</p>
      <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
        {guide.title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">
        {guide.excerpt}
      </p>

      <div className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-fg-muted">
        {guide.body.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>

      {guide.related?.length ? (
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          {guide.related.map((item) =>
            item.href.startsWith("http") ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-3 py-1.5 text-fg-muted transition hover:text-fg"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border px-3 py-1.5 text-fg-muted transition hover:text-fg"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/motion-transfer">Try Genjutsu</Button>
        <Button href="/examples" variant="secondary">
          See Examples
        </Button>
      </div>
    </article>
  );
}
