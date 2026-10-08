import { Button } from "@/components/ui/Button";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "GENJUTSU (genjutsu.online) is an independent site for AI video motion transfer — character + reference video → AI video.",
  path: "/about",
  keywords: ["About", "Genjutsu"],
});

export default function AboutPage() {
  return (
    <div className="page-shell max-w-3xl pb-20 pt-[112px]">
      <p className="eyebrow">About</p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        GENJUTSU
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-fg-muted">
        genjutsu.online is a visual AI video site focused on Genjutsu-style
        motion transfer: turn any character into a video using a reference
        performance.
      </p>
      <p className="mt-4 text-base leading-relaxed text-fg-muted">
        Core idea: <span className="text-fg">Your Character</span> +{" "}
        <span className="text-fg">Reference Video</span> →{" "}
        <span className="text-accent">Motion Transfer</span> →{" "}
        <span className="text-fg">AI Video</span>.
      </p>
      <p className="mt-4 text-base leading-relaxed text-fg-muted">
        This is an independent site. It is not the official Higgsfield website
        and is not affiliated with Higgsfield. We explain Genjutsu / AI motion
        transfer concepts, showcase workflows and curate related tools.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/motion-transfer">Try Genjutsu</Button>
        <Button href="/guides" variant="secondary">
          Read Guides
        </Button>
      </div>
    </div>
  );
}
