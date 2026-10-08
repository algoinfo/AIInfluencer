export type Style = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export const styles: Style[] = [
  {
    slug: "ai-fashion",
    name: "AI Fashion",
    description: "Editorial looks and runway-ready virtual creators.",
    image: "/images/nova.jpg",
  },
  {
    slug: "ai-dance",
    name: "AI Dance",
    description: "Motion-first clips built for TikTok and Reels.",
    image: "/images/elise.jpg",
  },
  {
    slug: "ai-lifestyle",
    name: "AI Lifestyle",
    description: "Everyday scenes with aspirational digital creators.",
    image: "/images/luna.jpg",
  },
  {
    slug: "ai-beauty",
    name: "AI Beauty",
    description: "Soft glam, skincare, and close-up character content.",
    image: "/images/sora.jpg",
  },
  {
    slug: "ai-couple",
    name: "AI Couple",
    description: "Dual-character stories that feel cinematic and real.",
    image: "/images/rio.jpg",
  },
  {
    slug: "ai-travel",
    name: "AI Travel",
    description: "Destination content with a consistent creator identity.",
    image: "/images/kai.jpg",
  },
  {
    slug: "ai-luxury",
    name: "AI Luxury",
    description: "Quiet luxury aesthetics for premium brand stories.",
    image: "/images/mia.jpg",
  },
  {
    slug: "ai-anime",
    name: "AI Anime",
    description: "Stylized characters with a bold social presence.",
    image: "/images/aya.jpg",
  },
];

export function getStyle(slug: string) {
  return styles.find((style) => style.slug === slug);
}
