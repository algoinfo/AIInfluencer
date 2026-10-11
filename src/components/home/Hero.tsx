import { MotionStudio } from "@/components/home/MotionStudio";

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-bg pt-[72px]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-8%,rgba(216,255,62,0.12),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_95%_15%,rgba(140,160,190,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_5%_75%,rgba(100,120,140,0.1),transparent_50%)]" />
        <div className="absolute left-1/2 top-[18%] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_70%)] blur-3xl" />
        <div className="film-grain absolute inset-0 opacity-40" />
      </div>

      <div className="page-shell-wide relative flex flex-1 flex-col pb-5 pt-2 sm:pb-6 sm:pt-3">
        <div className="mx-auto shrink-0 animate-rise px-1 text-center">
          <p className="text-[0.7rem] font-medium tracking-[0.18em] text-fg-subtle uppercase">
            Genjutsu
          </p>
          <h1 className="mt-1.5 font-display text-[clamp(1.35rem,3.2vw,2rem)] font-semibold leading-tight tracking-tight text-fg">
            AI Motion Transfer Video Generator
          </h1>
          <p className="mx-auto mt-1.5 max-w-xl text-[0.8rem] leading-snug text-fg-muted sm:text-[0.9rem]">
            Still + reference video → clip. Register for welcome credits; buy
            packs when you scale.
          </p>
        </div>

        <div className="material-well mx-auto mt-3 flex min-h-[min(720px,calc(100dvh-9rem))] w-full max-w-7xl flex-1 overflow-hidden rounded-[1.35rem] p-[1px] sm:mt-4 sm:rounded-[1.5rem] lg:min-h-[calc(100dvh-9.5rem)]">
          <div className="min-h-0 w-full flex-1 overflow-hidden rounded-[1.3rem] bg-black/20 sm:rounded-[1.45rem]">
            <MotionStudio />
          </div>
        </div>
      </div>
    </section>
  );
}
