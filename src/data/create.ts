export const characterStyles = [
  "Fashion",
  "Beauty",
  "Fitness",
  "Gaming",
  "Lifestyle",
  "Travel",
  "Anime",
  "Luxury",
] as const;

export type CharacterStyle = (typeof characterStyles)[number];

export const styleVisuals: Record<CharacterStyle, string> = {
  Fashion: "/images/nova.jpg",
  Beauty: "/images/sora.jpg",
  Fitness: "/images/kai.jpg",
  Gaming: "/images/valen.jpg",
  Lifestyle: "/images/luna.jpg",
  Travel: "/images/rio.jpg",
  Anime: "/images/aya.jpg",
  Luxury: "/images/elise.jpg",
};

export const contentActions = [
  {
    slug: "photo",
    title: "Generate Photo",
    description: "Create scroll-ready stills of your character.",
  },
  {
    slug: "video",
    title: "Create Video",
    description: "Produce short cinematic clips for social.",
  },
  {
    slug: "dance",
    title: "Make Them Dance",
    description: "Animate performance and dance sequences.",
  },
  {
    slug: "talking",
    title: "Talking Video",
    description: "Generate talking avatar content with voice.",
  },
  {
    slug: "social",
    title: "Social Post",
    description: "Package posts for Instagram, TikTok and Shorts.",
  },
] as const;

export const capabilities = [
  {
    title: "Create Photos",
    description: "Generate realistic social media photos.",
  },
  {
    title: "Create Videos",
    description: "Turn your character into engaging videos.",
  },
  {
    title: "Animate",
    description: "Make your influencer move and dance.",
  },
  {
    title: "Talk",
    description: "Create talking avatar videos.",
  },
  {
    title: "Stay Consistent",
    description: "Keep the same character across content.",
  },
  {
    title: "Create for Social",
    description: "Generate content for Instagram, TikTok and YouTube.",
  },
] as const;

export function mockCharacterName(style: string) {
  const names: Record<string, string[]> = {
    Fashion: ["Nova", "Mia", "Elise"],
    Beauty: ["Sora", "Lina", "Ava"],
    Fitness: ["Kai", "Atlas", "Rex"],
    Gaming: ["Valen", "Nyx", "Zero"],
    Lifestyle: ["Luna", "Iris", "Eden"],
    Travel: ["Rio", "Sky", "Mara"],
    Anime: ["Aya", "Hana", "Yuri"],
    Luxury: ["Elise", "Claire", "Vivienne"],
  };
  const pool = names[style] || names.Fashion;
  return pool[0];
}
