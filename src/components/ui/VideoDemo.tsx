type VideoDemoProps = {
  label: string;
  caption?: string;
  tone?: "character" | "reference" | "output";
  className?: string;
  aspect?: "portrait" | "landscape" | "square";
};

const tones = {
  character:
    "from-[#2a2430] via-[#1a1820] to-[#0e0e12]",
  reference:
    "from-[#1a2430] via-[#141820] to-[#0e1014]",
  output:
    "from-[#24301a] via-[#181c12] to-[#0e120c]",
};

const aspects = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-video",
  square: "aspect-square",
};

export function VideoDemo({
  label,
  caption,
  tone = "reference",
  className = "",
  aspect = "portrait",
}: VideoDemoProps) {
  return (
    <div className={["group relative", className].join(" ")}>
      <div
        className={[
          "media-frame relative film-grain rounded-2xl",
          aspects[aspect],
        ].join(" ")}
      >
        <div
          className={[
            "absolute inset-0 bg-gradient-to-br video-shimmer",
            tones[tone],
          ].join(" ")}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.12),transparent_42%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-fg-muted backdrop-blur-md">
          {label}
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/35 backdrop-blur-md transition-transform duration-500 group-hover:scale-105">
            <div className="ml-0.5 h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-fg" />
          </div>
        </div>

        {tone === "output" ? (
          <div className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
        ) : null}
      </div>
      {caption ? (
        <p className="mt-2.5 text-sm text-fg-muted">{caption}</p>
      ) : null}
    </div>
  );
}
