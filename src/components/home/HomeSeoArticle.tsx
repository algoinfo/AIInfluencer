import Image from "next/image";
import Link from "next/link";
import {
  homeExamples,
  homeUseCases,
  homeWhatIs,
} from "@/data/home-content";

export function HomeSeoArticle() {
  return (
    <article className="border-t border-border py-16 sm:py-20">
      <div className="page-shell max-w-3xl">
        <h2
          id="what-is-ai-motion-transfer"
          className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {homeWhatIs.title}
        </h2>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-fg-muted">
          {homeWhatIs.paragraphs.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
          Start in the{" "}
          <Link href="/#studio" className="text-fg underline-offset-2 hover:underline">
            studio
          </Link>
          , or read{" "}
          <Link
            href="/guides/what-is-ai-motion-transfer"
            className="text-fg underline-offset-2 hover:underline"
          >
            the motion transfer guide
          </Link>
          ,{" "}
          <Link href="/examples" className="text-fg underline-offset-2 hover:underline">
            examples
          </Link>
          , and{" "}
          <Link href="/pricing" className="text-fg underline-offset-2 hover:underline">
            credit pricing
          </Link>
          .
        </p>
      </div>

      <div className="page-shell mt-16">
        <h2
          id="use-cases"
          className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Use cases
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Same inputs — character still plus motion clip — different jobs.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {homeUseCases.map((item) => (
            <section
              key={item.id}
              id={item.id}
              className="rounded-2xl border border-border bg-surface/50 p-5 sm:p-6"
            >
              <h3 className="text-base font-medium text-fg">
                <Link href={item.href} className="hover:text-accent">
                  {item.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{item.body}</p>
            </section>
          ))}
        </div>
      </div>

      <div className="page-shell mt-16">
        <h2
          id="motion-examples"
          className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Examples: still + motion → video
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Studio library stills with typical generation settings. Open{" "}
          <Link href="/examples" className="text-fg underline-offset-2 hover:underline">
            Examples
          </Link>{" "}
          for more, or jump to{" "}
          <Link href="/#studio" className="text-fg underline-offset-2 hover:underline">
            generate
          </Link>
          .
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {homeExamples.map((ex) => (
            <Link
              key={ex.id}
              href={ex.href}
              className="group overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={ex.src}
                  alt={ex.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-fg">{ex.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{ex.result}</p>
                <p className="mt-2 font-mono text-[11px] leading-relaxed text-fg-muted/80">
                  {ex.params}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
