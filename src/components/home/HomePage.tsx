import { Hero } from "@/components/home/Hero";
import { HomeSeoArticle } from "@/components/home/HomeSeoArticle";
import { CreditsPricing } from "@/components/pricing/CreditsPricing";
import { Button } from "@/components/ui/Button";
import { homeFaqs } from "@/data/home-content";

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
      <HomeSeoArticle />

      <section className="border-t border-border py-14 sm:py-16">
        <div className="page-shell">
          <h2 className="text-center font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            How to generate
          </h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.n}
                className="rounded-2xl border border-border bg-surface/70 p-5 text-center"
              >
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm text-accent">
                  {step.n}
                </div>
                <h3 className="mt-4 text-base font-medium text-fg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg-soft py-14 sm:py-16">
        <div className="page-shell">
          <h2 className="text-center font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Features
          </h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-surface/50 px-5 py-4"
              >
                <h3 className="text-sm font-medium text-fg">{item.title}</h3>
                <p className="mt-1.5 text-sm text-fg-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            FAQ
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
