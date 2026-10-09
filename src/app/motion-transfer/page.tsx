import Link from "next/link";
import { MotionStudio } from "@/components/home/MotionStudio";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PageHero } from "@/components/ui/PageHero";
import { WELCOME_CREDITS } from "@/lib/credit-limits";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Motion Transfer – Turn Images Into Videos | Genjutsu",
  description:
    "AI motion transfer maps movement from a reference video onto a character or product image. Generate dance, influencer, and product clips in the Genjutsu studio.",
  path: "/motion-transfer",
  absoluteTitle: true,
  keywords: [
    "AI motion transfer",
    "motion control video",
    "character motion transfer",
    "reference video AI",
  ],
});

const concepts = [
  {
    title: "What is Motion Transfer?",
    body: "Motion transfer maps movement from a reference video onto your character so the performance stays, while the subject changes.",
  },
  {
    title: "Reference Video",
    body: "The motion source — dance, walk, gesture or camera-aware action you want to reuse.",
  },
  {
    title: "Character",
    body: "Your subject: a photo, illustrated character or consistent AI influencer identity.",
  },
  {
    title: "Movement",
    body: "Body timing, pose transitions and energy inherited from the reference clip.",
  },
  {
    title: "Camera Motion",
    body: "Framing and camera feel can travel with the reference, depending on the model.",
  },
  {
    title: "Generated Video",
    body: "The output AI video where your character performs the transferred motion.",
  },
];

const faq = [
  {
    q: "What is AI motion transfer?",
    a: "AI motion transfer takes the pose, timing, and often camera energy from a reference video and applies that performance to another subject — usually a character or product still — so you get a new clip without inventing the choreography from text alone.",
  },
  {
    q: "How do I use motion transfer on Genjutsu?",
    a: "Upload a character or product image and a motion reference in the studio on this page, then generate after login. Credits scale with the length of the uploaded motion video.",
  },
  {
    q: "Do I need to sign up?",
    a: `Yes. Real generation needs an account. New accounts receive ${WELCOME_CREDITS} welcome credits to run the same studio pipeline used on the homepage.`,
  },
  {
    q: "What inputs work best?",
    a: "Use a clear still with a readable subject, and a short reference with stable framing and visible full-body or product motion. Match camera height between the still and the clip when you can.",
  },
  {
    q: "Is motion transfer the same as Object Swap?",
    a: "No. Motion Transfer rebuilds the performance around your still as the hero identity. Object Swap keeps a person or scene from the source video and mainly replaces a held item or garment.",
  },
  {
    q: "Where else should I go for specific jobs?",
    a: "Dance → /dance-video. UGC ads → /ugc-video-generator. Pet dance → /ai-pet-dance. Avatar clips → /avatar-video-generator. Influencer batches → /ai-influencer.",
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

export default function MotionTransferPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        eyebrow="Genjutsu"
        title="AI Motion Transfer"
        subtitle="Bring any character to life with the movement of a reference video."
      />

      <section className="border-b border-border bg-bg pb-10 pt-2 sm:pb-12">
        <div className="page-shell">
          <div className="mx-auto flex h-[min(85vh,920px)] min-h-[560px] w-full max-w-6xl">
            <MotionStudio />
          </div>
        </div>
      </section>

      <section className="section-pad border-b border-border bg-bg-soft">
        <div className="page-shell max-w-3xl space-y-6">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            How AI motion transfer works
          </h2>
          <p className="text-base leading-relaxed text-fg-muted">
            You provide two inputs: a still of the subject you want on screen,
            and a reference video that already contains the performance. The
            model reads pose and timing from the clip, then maps that motion
            onto your image. Genjutsu is built for this reference-driven path —
            not for inventing choreography from a prompt alone.
          </p>
          <p className="text-base leading-relaxed text-fg-muted">
            Use it for dance, walks, product demos, and influencer-style
            performances when identity must stay locked while movement changes.
            For job-specific landings see{" "}
            <Link href="/dance-video" className="text-fg underline-offset-2 hover:underline">
              free dance
            </Link>
            ,{" "}
            <Link
              href="/ugc-video-generator"
              className="text-fg underline-offset-2 hover:underline"
            >
              UGC video
            </Link>
            , and{" "}
            <Link
              href="/ai-influencer"
              className="text-fg underline-offset-2 hover:underline"
            >
              AI influencer
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="page-shell">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            The building blocks
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {concepts.map((item, index) => (
              <FeatureCard
                key={item.title}
                title={item.title}
                body={item.body}
                index={String(index + 1).padStart(2, "0")}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-border bg-bg-soft">
        <div className="page-shell max-w-3xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
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
