import { HomePage } from "@/components/home/HomePage";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { homeFaqs } from "@/data/home-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title:
    "AI Motion Transfer Video Generator — Recast Any Character | Genjutsu",
  description:
    "Create AI videos with Genjutsu: motion transfer and object swap. Upload a character image and reference video, pick resolution, and generate online.",
  path: "/",
  absoluteTitle: true,
  keywords: [
    "AI video generator",
    "motion transfer AI",
    "object swap AI",
    "Genjutsu online",
    "AI character video",
  ],
});

export default function Home() {
  return (
    <>
      <FaqJsonLd faqs={homeFaqs} />
      <HomePage />
    </>
  );
}
