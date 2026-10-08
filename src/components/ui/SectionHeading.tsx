type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={[
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      ].join(" ")}
    >
      <h2 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl md:text-[2.6rem]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-base leading-relaxed text-fg-muted sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
