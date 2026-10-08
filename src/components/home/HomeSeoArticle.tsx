import Image from "next/image";
import Link from "next/link";
import {
  homeExamples,
  homeUseCases,
  homeWhatIs,
  homeWhatYouCanCreate,
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
          Open the{" "}
          <Link href="/#studio" className="text-fg underline-offset-2 hover:underline">
            studio
          </Link>
          , read{" "}
          <Link
            href="/motion-transfer"
            className="text-fg underline-offset-2 hover:underline"
          >
            how motion transfer works
          </Link>
          , browse{" "}
          <Link href="/examples" className="text-fg underline-offset-2 hover:underline">
            examples
          </Link>
          , or check{" "}
          <Link href="/pricing" className="text-fg underline-offset-2 hover:underline">
            pricing
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
          Same workflow — reference image plus reference video — different jobs.
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
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-fg-muted">
                {item.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="page-shell mt-16">
        <h2
          id="what-can-you-create"
          className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {homeWhatYouCanCreate.title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          {homeWhatYouCanCreate.intro}
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {homeWhatYouCanCreate.items.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className="block h-full rounded-2xl border border-border bg-surface/50 px-5 py-4 transition-colors hover:border-border-strong hover:bg-surface"
              >
                <h3 className="text-sm font-medium text-fg">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {item.body}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="page-shell mt-16">
        <h2
          id="motion-examples"
          className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Examples: still + motion → video
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Studio library stills with typical settings.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {homeExamples.map((ex) => (
            <div
              key={ex.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={ex.src}
                  alt={ex.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <p className="absolute bottom-3 left-3 text-sm font-medium text-fg">
                  {ex.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
