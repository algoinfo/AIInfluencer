import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { HomeSeoArticle } from "@/components/home/HomeSeoArticle";
import { CreditsPricing } from "@/components/pricing/CreditsPricing";
import { Button } from "@/components/ui/Button";
import { homeExamples, homeFaqs } from "@/data/home-content";

const steps = [
  {
    n: "01",
    title: "Upload character",
    body: "Add a JPG/PNG of the subject you want in the video.",
  },
  {
    n: "02",
    title: "Add motion reference",
    body: "Upload a short clip with the movement to transfer.",
  },
  {
    n: "03",
    title: "Generate AI video",
    body: "Run Genjutsu and download your motion-transfer clip.",
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
        className="relative border-t border-border py-14 sm:py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(255,255,255,0.03),transparent_60%)]" />
        <div className="page-shell-wide relative max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.7rem] font-medium tracking-[0.16em] text-fg-subtle uppercase">
              Gallery
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Examples: still + motion → video
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-fg-muted">
              Same workflow — character still plus motion reference — different
              looks.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {homeExamples.map((ex) => (
              <Link
                key={ex.id}
                href={ex.href}
                className="material-panel group overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-0.5 hover:border-border-strong"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={ex.src}
                    alt={ex.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-sm font-medium text-fg">{ex.title}</p>
                    <p className="mt-0.5 text-[0.7rem] tracking-wide text-fg-subtle">
                      {ex.params}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/[0.08] py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_30%,rgba(255,255,255,0.04),transparent_60%)]" />
        <div className="page-shell relative max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.7rem] font-medium tracking-[0.16em] text-fg-subtle uppercase">
              Workflow
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              From still to clip in three steps
            </h2>
          </div>
          <ol className="mx-auto mt-10 grid gap-4 sm:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.n}
                className="material-panel-soft rounded-2xl px-5 py-6"
              >
                <p className="font-display text-sm font-semibold tracking-[0.14em] text-accent">
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

      <section className="border-t border-border py-14 sm:py-20">
        <div className="page-shell max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.7rem] font-medium tracking-[0.16em] text-fg-subtle uppercase">
              Product
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Built to be quick and clean
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-fg-muted">
              No installs — open the studio and generate.
            </p>
          </div>
          <div className="mx-auto mt-10 grid gap-3 sm:grid-cols-2">
            {features.map((item) => (
              <div
                key={item.title}
                className="material-panel rounded-2xl px-5 py-5 transition hover:border-border-strong"
              >
                <h3 className="text-sm font-medium text-fg">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeSeoArticle />

      <section className="relative border-t border-border py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(216,255,62,0.04),transparent_55%)]" />
        <div className="page-shell relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.7rem] font-medium tracking-[0.16em] text-fg-subtle uppercase">
              Pricing
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Pay once. Credits for every video.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
              One-time packs · bonus credits · never expire.
            </p>
          </div>
          <div className="mt-10">
            <CreditsPricing compact />
          </div>
          <div className="mt-8 text-center">
            <Button href="/pricing" variant="secondary">
              View full pricing
            </Button>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="relative border-t border-white/[0.08] py-14 sm:py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_80%_20%,rgba(216,255,62,0.04),transparent_55%)]" />
        <div className="page-shell relative max-w-3xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.7rem] font-medium tracking-[0.16em] text-fg-subtle uppercase">
              FAQ
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mt-10 space-y-3">
            {homeFaqs.map((item) => (
              <div
                key={item.q}
                className="material-panel-soft rounded-2xl px-5 py-4"
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
