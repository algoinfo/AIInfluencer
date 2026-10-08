import { VideoDemo } from "@/components/ui/VideoDemo";

export type VideoCardProps = {
  title: string;
  description: string;
  category: string;
  tone?: "character" | "reference" | "output";
};

export function VideoCard({
  title,
  description,
  category,
  tone = "output",
}: VideoCardProps) {
  return (
    <article className="group">
      <VideoDemo label={category} tone={tone} aspect="portrait" />
      <h3 className="font-display mt-4 text-lg font-semibold tracking-tight transition-colors group-hover:text-accent">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
        {description}
      </p>
    </article>
  );
}
