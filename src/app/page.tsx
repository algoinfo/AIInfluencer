import { HomePage } from "@/components/home/HomePage";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { homeFaqs } from "@/data/home-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Genjutsu AI — AI Motion Transfer Video Generator",
  description:
    "AI motion transfer for characters, products, and influencers. Upload a reference image and video, then generate dance, product, fashion, and UGC-style clips online.",
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
