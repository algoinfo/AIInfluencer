import { MotionStudio } from "@/components/home/MotionStudio";

export function Hero() {
  return (
    <section className="relative flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-bg pt-[72px]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(216,255,62,0.05),transparent_55%)]" />
      </div>

      <div className="page-shell-wide relative flex min-h-0 flex-1 flex-col pb-3 pt-2 sm:pb-4 sm:pt-2.5">
        <div className="mx-auto shrink-0 animate-rise text-center">
          <h1 className="font-display text-[clamp(1.15rem,2.4vw,1.65rem)] font-semibold leading-tight tracking-tight text-fg">
            Genjutsu
          </h1>
          <p className="mx-auto mt-0.5 max-w-xl text-[0.75rem] leading-snug text-fg-subtle sm:text-[0.8rem]">
            AI motion transfer · image + reference video → clip
          </p>
        </div>

        <div className="mx-auto mt-2.5 flex min-h-0 w-full max-w-6xl flex-1 sm:mt-3">
          <MotionStudio />
        </div>
      </div>
    </section>
  );
}
