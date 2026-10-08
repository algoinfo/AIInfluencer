import { MotionStudio } from "@/components/home/MotionStudio";

export function Hero() {
  return (
    <section className="relative flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-bg pt-[72px]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />
        <div className="absolute -left-24 top-0 h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(80,140,140,0.12),transparent_65%)] blur-2xl" />
        <div className="absolute -right-16 top-8 h-[240px] w-[240px] rounded-full bg-[radial-gradient(circle,rgba(120,70,50,0.1),transparent_65%)] blur-2xl" />
      </div>

      <div className="page-shell relative flex min-h-0 flex-1 flex-col pb-3 pt-1.5 sm:pb-4 sm:pt-2">
        <div className="mx-auto shrink-0 animate-rise text-center">
          <h1 className="font-display text-[clamp(1.25rem,2.8vw,1.85rem)] font-semibold leading-tight tracking-tight text-fg">
            Genjutsu AI Video Generator
          </h1>
          <p className="mx-auto mt-1 max-w-xl text-[0.8rem] leading-snug text-fg-muted sm:text-sm">
            Character + reference clip → motion transfer video
          </p>
        </div>

        <div className="mx-auto mt-2.5 flex min-h-0 w-full max-w-6xl flex-1 sm:mt-3">
          <MotionStudio />
        </div>
      </div>
    </section>
  );
}
