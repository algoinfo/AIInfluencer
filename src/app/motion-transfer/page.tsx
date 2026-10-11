import Link from "next/link";
import { MotionStudio } from "@/components/home/MotionStudio";
import { CTA } from "@/components/ui/CTA";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { WELCOME_CREDITS } from "@/lib/credit-limits";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Motion Transfer – Turn Images Into Videos | Genjutsu",
  description:
    "AI motion transfer: upload a character still and a reference video, then generate a new clip in the Genjutsu studio. Welcome credits on signup; buy packs when you need more.",
  path: "/motion-transfer",
  absoluteTitle: true,
  keywords: [
    "AI motion transfer",
    "motion control video",
    "character motion transfer",
    "reference video AI",
  ],
});

const steps = [
  {
    n: "1",
    title: "Upload a character still",
    body: "JPG or PNG of the person, product, or influencer identity you want on screen.",
  },
  {
    n: "2",
    title: "Add a motion reference",
    body: "A short dance, walk, gesture, or product demo clip that already has the performance.",
  },
  {
    n: "3",
    title: "Generate in the studio",
    body: "Pick model and resolution, then run. Credits scale with the length of the motion video.",
  },
];

const concepts = [
  {
    title: "What is Motion Transfer?",
    body: "Maps movement from a reference video onto your character so the performance stays, while the subject changes.",
  },
  {
    title: "Reference Video",
    body: "The motion source — dance, walk, gesture, or camera-aware action you want to reuse.",
  },
  {
    title: "Character",
    body: "Your subject: a photo, illustrated character, or consistent AI influencer identity.",
  },
  {
    title: "Movement",
    body: "Body timing, pose transitions, and energy inherited from the reference clip.",
  },
  {
    title: "Camera Motion",
    body: "Framing and camera feel can travel with the reference, depending on the model.",
  },
  {
    title: "Generated Video",
    body: "The output MP4 where your character performs the transferred motion.",
  },
];

const faq = [
  {
    q: "What is AI motion transfer?",
    a: "AI motion transfer takes pose, timing, and often camera energy from a reference video and applies that performance to another subject — usually a character or product still — so you get a new clip without inventing choreography from text alone.",
  },
  {
    q: "How do I use motion transfer on Genjutsu?",
    a: "Upload a character or product image and a motion reference in the studio on this page, then generate after login. Credits scale with the length of the uploaded motion video.",
  },
  {
    q: "Do I need to sign up? How much does it cost?",
    a: `Yes — real generation needs an account. New accounts receive ${WELCOME_CREDITS} welcome credits for the same studio pipeline. When you need more, buy one-time packs on Pricing; credits do not expire.`,
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

      <section className="cinema-bg border-b border-border pt-[112px]">
        <div className="page-shell-wide mx-auto max-w-7xl pb-6 pt-4 sm:pb-8 sm:pt-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.75rem] font-medium tracking-[0.04em] text-fg-subtle sm:text-[0.8rem]">
              Genjutsu studio
            </p>
            <h1 className="mt-2 font-display text-[clamp(1.75rem,4.5vw,2.75rem)] font-semibold leading-tight tracking-tight text-fg">
              AI Motion Transfer
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-[0.95rem] leading-relaxed text-fg-muted sm:text-base">
              Still + reference video → new clip. Sign up for{" "}
              {WELCOME_CREDITS} welcome credits, generate in the studio, then
              buy packs when you need more.
            </p>
            <p className="mt-3 text-sm text-fg-subtle">
              Motion Transfer · Object Swap · Credits by motion length
            </p>
          </div>

          <div className="mx-auto mt-6 flex min-h-[min(680px,calc(100dvh-12rem))] w-full max-lg:min-h-[640px] sm:mt-8 lg:h-[min(85vh,920px)]">
            <MotionStudio />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-bg-soft py-12 sm:py-16">
        <div className="page-shell max-w-4xl">
          <h2 className="text-center font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            From still to clip in three steps
          </h2>
          <ol className="mx-auto mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {steps.map((step) => (
              <li key={step.n} className="text-center sm:text-left">
                <p className="font-display text-3xl font-semibold tabular-nums text-accent/90">
                  {step.n}
                </p>
                <h3 className="mt-3 text-base font-medium text-fg">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-pad border-b border-border">
        <div className="page-shell max-w-3xl space-y-5">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            How AI motion transfer works
          </h2>
          <p className="text-base leading-relaxed text-fg-muted">
            You provide two inputs: a still of the subject you want on screen,
            and a reference video that already contains the performance. The
            model reads pose and timing from the clip, then maps that motion
            onto your image — a reference-driven path, not choreography invented
            from a prompt alone.
          </p>
          <p className="text-base leading-relaxed text-fg-muted">
            Use it for dance, walks, product demos, and influencer-style
            performances when identity must stay locked while movement changes.
            Job-specific landings:{" "}
            <Link
              href="/dance-video"
              className="text-fg underline-offset-2 hover:underline"
            >
              AI dance video
            </Link>
            ,{" "}
            <Link
              href="/ugc-video-generator"
              className="text-fg underline-offset-2 hover:underline"
            >
              UGC video
            </Link>
            ,{" "}
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

      <section className="section-pad border-b border-border bg-bg-soft">
        <div className="page-shell">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
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

      <section className="section-pad border-b border-border">
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

      <CTA
        title="Ready to transfer motion?"
        body={`Sign up for ${WELCOME_CREDITS} welcome credits, or open Pricing when you need more volume.`}
        primaryHref="#studio"
        primaryLabel="Open studio"
        secondaryHref="/pricing"
        secondaryLabel="Buy credits"
      />
    </>
  );
}
