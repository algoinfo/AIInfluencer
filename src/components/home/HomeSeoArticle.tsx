import Link from "next/link";
import {
  homeUseCases,
  homeWhatIs,
  homeWhatYouCanCreate,
} from "@/data/home-content";

export function HomeSeoArticle() {
  return (
    <article className="relative border-t border-white/[0.08] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_0%,rgba(255,255,255,0.035),transparent_60%)]" />
      <div className="page-shell relative max-w-3xl">
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

      <div className="page-shell relative mt-16">
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
              className="material-panel rounded-2xl p-5 sm:p-6"
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

      <div className="page-shell relative mt-16">
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
                className="material-panel-soft block h-full rounded-2xl px-5 py-4 transition hover:border-border-strong"
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
    </article>
  );
}
