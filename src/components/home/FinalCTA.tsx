import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="section-pad">
      <div className="page-shell">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(circle_at_20%_20%,rgba(230,220,200,0.14),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.04),transparent_40%),#171714] px-6 py-16 text-center sm:px-10 sm:py-20">
          <p className="eyebrow">AIInfluencer.world</p>
          <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Create Your AI Influencer
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-fg-muted">
            Your character.
            <br />
            Your content.
            <br />
            Your audience.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/create" size="lg">
              Create Your Influencer
            </Button>
            <Button href="/video" variant="secondary" size="lg">
              Create Video
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
