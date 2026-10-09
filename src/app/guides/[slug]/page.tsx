import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getGuide, guides } from "@/data/guides";
import { pageMetadata } from "@/lib/seo";

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
  return pageMetadata({
    title: guide.title,
    description: guide.excerpt,
    path: `/guides/${slug}`,
    keywords: ["Genjutsu guide", "AI video tutorial", guide.title],
  });
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

      <div className="mt-10 max-w-2xl space-y-10">
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-fg-muted">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {guide.params?.length ? (
        <section className="mt-12 max-w-2xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Practical parameters
          </h2>
          <dl className="mt-5 divide-y divide-border rounded-2xl border border-border">
            {guide.params.map((param) => (
              <div
                key={param.label}
                className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
              >
                <dt className="text-sm font-medium text-fg">{param.label}</dt>
                <dd className="text-sm leading-relaxed text-fg-muted">
                  {param.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          FAQ
        </h2>
        <dl className="mt-5 space-y-6">
          {guide.faq.map((item) => (
            <div key={item.q}>
              <dt className="font-medium text-fg">{item.q}</dt>
              <dd className="mt-2 text-base leading-relaxed text-fg-muted">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

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
        <Button href="/#studio">Open studio</Button>
        <Button href="/examples" variant="secondary">
          See Examples
        </Button>
      </div>
    </article>
  );
}
