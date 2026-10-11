import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { HomeSeoArticle } from "@/components/home/HomeSeoArticle";
import { CreditsPricing } from "@/components/pricing/CreditsPricing";
import { Button } from "@/components/ui/Button";
import { homeExamples, homeFaqs } from "@/data/home-content";

const steps = [
  {
    n: "1",
    title: "Upload character",
    body: "Add a JPG/PNG of the subject you want in the video.",
  },
  {
    n: "2",
    title: "Add motion reference",
    body: "Upload a short clip with the movement to transfer.",
  },
  {
    n: "3",
    title: "Generate AI video",
    body: "Run Genjutsu AI Video Generator and get your result.",
  },
];

const features = [
  {
    title: "AI Video Generator",
    body: "Create videos from character + motion reference in one tool.",
  },
  {
    title: "Motion Transfer",
    body: "Copy movement from a reference video onto your character.",
  },
  {
    title: "Character Swap",
    body: "Keep the performance, replace the person on screen.",
  },
  {
    title: "Object Swap",
    body: "Swap products, clothes, and visual elements in the scene.",
  },
];

export function HomePage() {
  return (
    <>
      <Hero />

      <section
        id="motion-examples"
        className="border-t border-border py-12 sm:py-16"
      >
        <div className="page-shell-wide max-w-7xl">
          <h2 className="text-center font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Examples: still + motion → video
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-fg-muted">
            Same workflow — character still plus motion reference — different
            looks.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {homeExamples.map((ex) => (
              <Link
                key={ex.id}
                href={ex.href}
                className="group overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-border-strong"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={ex.src}
                    alt={ex.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    <p className="text-sm font-medium text-fg">{ex.title}</p>
                    <p className="mt-0.5 text-[0.75rem] text-fg-subtle">
                      {ex.params}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg-soft py-12 sm:py-16">
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

      <section className="border-t border-border py-12 sm:py-16">
        <div className="page-shell max-w-4xl">
          <h2 className="text-center font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Built to be quick and clean
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-fg-muted">
            No installs — open the studio and generate.
          </p>
          <div className="mx-auto mt-8 grid gap-3 sm:grid-cols-2">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-surface/40 px-5 py-4"
              >
                <h3 className="text-sm font-medium text-fg">{item.title}</h3>
                <p className="mt-1.5 text-sm text-fg-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeSeoArticle />

      <section className="border-t border-border py-14 sm:py-16">
        <div className="page-shell">
          <h2 className="text-center font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Pricing
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-fg-muted">
            One-time packs · bonus credits · never expire.
          </p>
          <div className="mt-8">
            <CreditsPricing compact />
          </div>
          <div className="mt-8 text-center">
            <Button href="/pricing" variant="secondary">
              View full pricing
            </Button>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-border bg-bg-soft py-14 sm:py-16">
        <div className="page-shell max-w-3xl">
          <h2 className="text-center font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-3">
            {homeFaqs.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-border bg-surface/60 px-5 py-4"
              >
                <h3 className="text-sm font-medium text-fg">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
