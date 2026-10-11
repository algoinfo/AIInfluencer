import { MotionStudio } from "@/components/home/MotionStudio";

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col bg-bg pt-14 lg:h-[100dvh] lg:max-h-[100dvh] lg:overflow-hidden lg:pt-[72px]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-8%,rgba(216,255,62,0.12),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_95%_15%,rgba(140,160,190,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_5%_75%,rgba(100,120,140,0.1),transparent_50%)]" />
        <div className="absolute left-1/2 top-[18%] hidden h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_70%)] blur-3xl lg:block" />
        <div className="film-grain absolute inset-0 opacity-40" />
      </div>

      <div className="page-shell-wide relative flex min-h-0 flex-1 flex-col px-3 pb-[calc(5.25rem+env(safe-area-inset-bottom))] pt-2 sm:px-4 lg:pb-4">
        <div className="mx-auto shrink-0 animate-rise px-1 text-center lg:px-1">
          <h1 className="font-display text-[1.55rem] font-semibold leading-none tracking-tight text-fg sm:text-[1.75rem] lg:text-[clamp(1.5rem,3.4vw,2.15rem)]">
            Genjutsu AI
          </h1>
          <p className="mt-1 font-display text-[0.85rem] font-medium leading-snug tracking-tight text-fg-muted sm:text-[0.95rem] lg:text-[clamp(0.9rem,2vw,1.2rem)]">
            AI Motion Transfer Video Generator
          </p>
        </div>

        <div className="material-well mx-auto mt-2.5 flex w-full max-w-7xl overflow-hidden rounded-2xl p-[1px] lg:mt-2.5 lg:min-h-0 lg:flex-1 lg:rounded-[1.4rem]">
          <div className="flex w-full overflow-hidden rounded-[0.95rem] bg-black/20 lg:min-h-0 lg:flex-1 lg:rounded-[1.35rem]">
            <MotionStudio />
          </div>
        </div>
      </div>
    </section>
  );
}
