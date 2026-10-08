export type Influencer = {
  slug: string;
  name: string;
  type: string;
  platforms: string[];
  image: string;
  height: "tall" | "medium" | "short";
};

export const influencers: Influencer[] = [
  {
    slug: "mia",
    name: "Mia",
    type: "Fashion Creator",
    platforms: ["Instagram", "TikTok"],
    image: "/images/mia.jpg",
    height: "tall",
  },
  {
    slug: "luna",
    name: "Luna",
    type: "Lifestyle",
    platforms: ["Instagram", "YouTube"],
    image: "/images/luna.jpg",
    height: "medium",
  },
  {
    slug: "nova",
    name: "Nova",
    type: "Digital Model",
    platforms: ["Instagram", "TikTok"],
    image: "/images/nova.jpg",
    height: "tall",
  },
  {
    slug: "aya",
    name: "Aya",
    type: "Anime Creator",
    platforms: ["TikTok", "YouTube"],
    image: "/images/aya.jpg",
    height: "short",
  },
  {
    slug: "kai",
    name: "Kai",
    type: "Fitness",
    platforms: ["Instagram", "TikTok"],
    image: "/images/kai.jpg",
    height: "medium",
  },
  {
    slug: "elise",
    name: "Elise",
    type: "Luxury",
    platforms: ["Instagram"],
    image: "/images/elise.jpg",
    height: "tall",
  },
  {
    slug: "rio",
    name: "Rio",
    type: "Travel",
    platforms: ["TikTok", "YouTube"],
    image: "/images/rio.jpg",
    height: "medium",
  },
  {
    slug: "sora",
    name: "Sora",
    type: "Beauty",
    platforms: ["Instagram", "TikTok"],
    image: "/images/sora.jpg",
    height: "short",
  },
  {
    slug: "valen",
    name: "Valen",
    type: "Gaming",
    platforms: ["YouTube", "TikTok"],
    image: "/images/valen.jpg",
    height: "medium",
  },
];

export function getInfluencer(slug: string) {
  return influencers.find((item) => item.slug === slug);
}
