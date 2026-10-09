import Image from "next/image";
import Link from "next/link";
import { MotionStudio } from "@/components/home/MotionStudio";
import { PageHero } from "@/components/ui/PageHero";
import { motionLibraryClips } from "@/data/motion-library";
import { WELCOME_CREDITS } from "@/lib/credit-limits";

const faq = [
  {
    q: "What are these Genjutsu examples?",
    a: "They are motion-transfer looks from the same clip library used in the studio — styles like Flip, Recast, and New world that show how a still can inherit performance from a reference.",
  },
  {
    q: "Can I generate the same style with my own assets?",
    a: "Yes. Use the studio on this page: upload your character or product image, add a motion reference, and generate after login. Credits scale with motion length.",
  },
  {
    q: "Do I need an account to try examples?",
    a: `Browsing the gallery is free. Real generation needs login. New accounts get ${WELCOME_CREDITS} welcome credits for studio runs.`,
  },
  {
    q: "What is the difference between Examples and Motion Transfer?",
    a: "/examples is the gallery of looks plus a live studio. /motion-transfer is the SEO support page that explains the building blocks and FAQ for the AI motion transfer query.",
  },
  {
    q: "Where should I go for dance, UGC, or pet clips?",
    a: "Dance → /dance-video. UGC ads → /ugc-video-generator. Pet dance → /ai-pet-dance. Avatar → /avatar-video-generator. Influencer batches → /ai-influencer.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function ExamplesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        eyebrow="Gallery"
        title="Motion Transfer Examples"
        subtitle="Browse Genjutsu looks, then generate with your own image and reference video in the studio below."
      />

      <section className="border-b border-border bg-bg pb-10 pt-2 sm:pb-12">
        <div className="page-shell">
          <div className="mx-auto flex h-[min(85vh,920px)] min-h-[560px] w-full max-w-6xl">
            <MotionStudio />
          </div>
        </div>
      </section>

      <section className="section-pad border-b border-border bg-bg-soft">
        <div className="page-shell">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Example looks
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-fg-muted">
            Same clips featured in the studio library. Use them as style
            references, then generate with your own still and motion file.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {motionLibraryClips.map((clip) => (
              <a
                key={clip.id}
                id={clip.id}
                href="#studio"
                className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface scroll-mt-24"
              >
                <Image
                  src={clip.src}
                  alt={`${clip.label} motion transfer example`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <p className="absolute bottom-3 left-3 text-sm font-medium text-fg">
                  {clip.label}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-b border-border">
        <div className="page-shell max-w-3xl space-y-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            How to recreate an example
          </h2>
          <p className="text-base leading-relaxed text-fg-muted">
            Pick a look that matches the energy you want — flip, recast, or a
            new-world restyle. Lock a clear character or product still, then
            upload a short motion reference with readable poses. Generate in
            the studio above after login; iterate the still before you change
            every other variable.
          </p>
          <p className="text-base leading-relaxed text-fg-muted">
            For keyword landings tied to specific jobs, see{" "}
            <Link
              href="/motion-transfer"
              className="text-fg underline-offset-2 hover:underline"
            >
              AI motion transfer
            </Link>
            ,{" "}
            <Link
              href="/dance-video"
              className="text-fg underline-offset-2 hover:underline"
            >
              free dance video
            </Link>
            , and{" "}
            <Link
              href="/ugc-video-generator"
              className="text-fg underline-offset-2 hover:underline"
            >
              UGC video generator
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="section-pad bg-bg-soft">
        <div className="page-shell max-w-3xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            FAQ
          </h2>
          <dl className="mt-8 space-y-6">
            {faq.map((item) => (
              <div key={item.q}>
                <dt className="font-medium text-fg">{item.q}</dt>
                <dd className="mt-2 text-base leading-relaxed text-fg-muted">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
