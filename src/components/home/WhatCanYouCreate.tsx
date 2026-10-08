import Link from "next/link";

const chips = [
  "Character",
  "Fashion",
  "Product",
  "Anime",
  "Creative",
  "Cinematic",
];

const capabilities = [
  {
    category: "MOTION TRANSFER",
    title: "Make Any Character Move",
    description:
      "Transfer motion from a reference video to your character.",
    href: "/motion-transfer",
    cta: "Try Motion Transfer",
    featured: true,
    visual: "motion" as const,
  },
  {
    category: "CHARACTER SWAP",
    title: "Put Your Character Into Any Video",
    description:
      "Replace the original subject with your own character while keeping the movement.",
    href: "/motion-transfer",
    cta: "Try Character Swap",
    featured: false,
    visual: "character" as const,
  },
  {
    category: "OBJECT SWAP",
    title: "Replace Anything In Your Video",
    description:
      "Swap products, clothes and other visual elements while preserving the scene.",
    href: "/genjutsu",
    cta: "Explore Object Swap",
    featured: false,
    visual: "object" as const,
  },
  {
    category: "RESTYLE",
    title: "Restyle Any Performance",
    description:
      "Keep the motion from your reference and change the look, world or aesthetic.",
    href: "/genjutsu",
    cta: "Explore Restyle",
    featured: false,
    visual: "restyle" as const,
  },
];

const tones = {
  character: "from-[#2a2430] via-[#1a1820] to-[#0e0e12]",
  reference: "from-[#1a2430] via-[#141820] to-[#0e1014]",
  output: "from-[#24301a] via-[#181c12] to-[#0e120c]",
  product: "from-[#302820] via-[#1c1814] to-[#100e0c]",
};

export function WhatCanYouCreate() {
  return (
    <section className="section-pad border-t border-border bg-bg-soft">
      <div className="page-shell">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            What Can You Create?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-fg-muted">
            Transform your videos in a few clicks.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-6 lg:gap-7">
          {capabilities.map((card) => (
            <CapabilityCard key={card.category} {...card} />
          ))}
        </div>

        <div className="mt-6 lg:mt-8">
          <EndlessPossibilities />
        </div>
      </div>
    </section>
  );
}

function CapabilityCard({
  category,
  title,
  description,
  href,
  cta,
  featured,
  visual,
}: (typeof capabilities)[number]) {
  return (
    <Link
      href={href}
      className={[
        "group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface transition-colors duration-300",
        "hover:border-border-strong",
        featured ? "md:row-span-1" : "",
      ].join(" ")}
    >
      <div
        className={[
          "relative overflow-hidden border-b border-border",
          featured ? "min-h-[260px] sm:min-h-[320px]" : "min-h-[220px] sm:min-h-[250px]",
        ].join(" ")}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          <CapabilityVisual type={visual} />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-fg-subtle">
            {category}
          </p>
          <span className="mt-0.5 text-fg-subtle opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100">
            <Arrow />
          </span>
        </div>
        <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
          {description}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors group-hover:text-accent">
          {cta}
          <Arrow className="opacity-70 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
}

function CapabilityVisual({
  type,
}: {
  type: "motion" | "character" | "object" | "restyle";
}) {
  if (type === "motion") {
    return (
      <div className="flex h-full items-stretch gap-2 bg-[#09090b] p-4 sm:gap-3 sm:p-5">
        <Thumb label="Character" tone="character" className="flex-[0.95]" />
        <FlowLabel label="Motion Transfer" />
        <Thumb label="Generated Video" tone="output" className="flex-[1.25]" />
      </div>
    );
  }

  if (type === "character") {
    return (
      <div className="flex h-full items-stretch gap-2 bg-[#09090b] p-4 sm:p-5">
        <Thumb label="Original Video" tone="reference" />
        <FlowLabel label="Character" />
        <Thumb label="New Video" tone="output" />
      </div>
    );
  }

  if (type === "object") {
    return (
      <div className="flex h-full items-stretch gap-2 bg-[#09090b] p-4 sm:p-5">
        <Thumb label="Original Product" tone="product" />
        <FlowLabel label="New Product" />
        <Thumb label="Transformed Video" tone="output" />
      </div>
    );
  }

  return (
    <div className="flex h-full items-stretch gap-2 bg-[#09090b] p-4 sm:p-5">
      <Thumb label="Performance" tone="reference" />
      <FlowLabel label="Restyle" />
      <Thumb label="New Look" tone="output" />
    </div>
  );
}

function Thumb({
  label,
  tone,
  className = "",
  short,
  wide,
}: {
  label: string;
  tone: keyof typeof tones;
  className?: string;
  short?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={[
        "relative min-w-0 overflow-hidden rounded-xl border border-white/[0.08]",
        short ? "aspect-[5/4]" : wide ? "aspect-video w-full" : "aspect-[3/4] h-full",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 bg-gradient-to-br video-shimmer",
          tones[tone],
        ].join(" ")}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 backdrop-blur-sm">
          <div className="ml-0.5 h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-fg/90" />
        </div>
      </div>
      <div className="absolute left-2 top-2 rounded-full border border-white/10 bg-black/45 px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.14em] text-fg-muted backdrop-blur-md">
        {label}
      </div>
    </div>
  );
}

function FlowLabel({ label }: { label: string }) {
  return (
    <div className="flex w-12 shrink-0 flex-col items-center justify-center gap-2 self-center sm:w-16">
      <span className="text-fg-subtle">↓</span>
      <span className="text-center text-[0.58rem] uppercase leading-tight tracking-[0.12em] text-accent sm:text-[0.62rem]">
        {label}
      </span>
      <span className="text-fg-subtle">↓</span>
    </div>
  );
}

function EndlessPossibilities() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-border bg-surface">
      <div className="grid lg:grid-cols-[1.2fr_1fr]">
        <div className="group relative min-h-[280px] overflow-hidden border-b border-border lg:min-h-[400px] lg:border-b-0 lg:border-r">
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2430] via-[#141820] to-[#0e1014] video-shimmer" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.12),transparent_45%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-fg-muted backdrop-blur-md">
              Reference Video
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/35 backdrop-blur-md">
                <div className="ml-1 h-0 w-0 border-y-[7px] border-l-[12px] border-y-transparent border-l-fg" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-4xl">
            One Video. Endless Possibilities.
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted sm:text-base">
            Use one reference video to create completely different characters,
            products and visual styles.
          </p>

          <div className="mt-8 flex flex-col items-start gap-3">
            <span className="rounded-full border border-border bg-bg-soft px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-fg-muted">
              Reference Video
            </span>
            <span className="pl-4 text-fg-subtle">↓</span>
            <span className="rounded-full border border-accent/35 bg-[rgba(216,255,62,0.08)] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-accent">
              Genjutsu
            </span>
            <span className="pl-4 text-fg-subtle">↓</span>
            <div className="grid w-full max-w-sm grid-cols-3 gap-2">
              {["Character", "Product", "Fashion"].map((item) => (
                <span
                  key={item}
                  className="rounded-xl border border-border bg-bg-soft px-2 py-3 text-center text-sm text-fg"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border px-3 py-1.5 text-xs tracking-wide text-fg-muted"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2.5 7h9M7.5 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
