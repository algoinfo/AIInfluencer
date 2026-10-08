export type ToolCategory =
  | "Character Creation"
  | "Image Generation"
  | "Video Generation"
  | "Motion Transfer"
  | "AI Influencer";

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  initial: string;
};

export const toolCategories: ToolCategory[] = [
  "Character Creation",
  "Image Generation",
  "Video Generation",
  "Motion Transfer",
  "AI Influencer",
];

export const tools: Tool[] = [
  {
    slug: "genjutsu",
    name: "Genjutsu",
    description:
      "Reference-driven motion transfer for characters and AI video.",
    category: "Motion Transfer",
    initial: "G",
  },
  {
    slug: "higgsfield",
    name: "Higgsfield",
    description:
      "Cinematic AI video platform where Genjutsu-style workflows appear.",
    category: "Video Generation",
    initial: "H",
  },
  {
    slug: "kling",
    name: "Kling",
    description: "High-motion AI video generation for short-form clips.",
    category: "Video Generation",
    initial: "K",
  },
  {
    slug: "runway",
    name: "Runway",
    description: "Creative AI video tools for editorial motion and restyle.",
    category: "Video Generation",
    initial: "R",
  },
  {
    slug: "veo",
    name: "Veo",
    description: "High-fidelity video models for polished character shots.",
    category: "Video Generation",
    initial: "V",
  },
  {
    slug: "seedance",
    name: "Seedance",
    description: "Dance and body-motion focused generation.",
    category: "Motion Transfer",
    initial: "S",
  },
  {
    slug: "flux",
    name: "Flux",
    description: "Strong stills for locking character identity first.",
    category: "Image Generation",
    initial: "F",
  },
  {
    slug: "midjourney",
    name: "Midjourney",
    description: "Premium image looks for fashion and lifestyle characters.",
    category: "Image Generation",
    initial: "M",
  },
  {
    slug: "character-sheet",
    name: "Character Sheet",
    description: "Structure face, style and signature details before video.",
    category: "Character Creation",
    initial: "C",
  },
  {
    slug: "aiinfluencer-world",
    name: "AIInfluencer.world",
    description: "Create consistent AI influencers for motion workflows.",
    category: "AI Influencer",
    initial: "A",
  },
];

export const featuredTools = tools.slice(0, 6);

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
