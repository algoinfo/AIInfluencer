export type ExampleCategory =
  | "Dance"
  | "Fashion"
  | "AI Influencer"
  | "Character"
  | "Action"
  | "Product"
  | "Creative";

export type Example = {
  slug: string;
  title: string;
  description: string;
  category: ExampleCategory;
  tone: "character" | "reference" | "output";
};

export const exampleCategories: ExampleCategory[] = [
  "Dance",
  "Fashion",
  "AI Influencer",
  "Character",
  "Action",
  "Product",
  "Creative",
];

export const examples: Example[] = [
  {
    slug: "ai-influencer-dance",
    title: "AI Influencer Dance",
    description: "Reference choreography transferred onto a consistent creator.",
    category: "Dance",
    tone: "output",
  },
  {
    slug: "character-motion-transfer",
    title: "Character Motion Transfer",
    description: "Still character identity driven by a performance clip.",
    category: "Character",
    tone: "output",
  },
  {
    slug: "fashion-motion",
    title: "Fashion Motion",
    description: "Editorial walk cycles with camera-aware movement.",
    category: "Fashion",
    tone: "reference",
  },
  {
    slug: "product-showcase",
    title: "Product Showcase",
    description: "Hand and body motion for lifestyle product clips.",
    category: "Product",
    tone: "character",
  },
  {
    slug: "action-pose-transfer",
    title: "Action Pose Transfer",
    description: "High-energy body mechanics for short action beats.",
    category: "Action",
    tone: "output",
  },
  {
    slug: "creative-restyle-motion",
    title: "Creative Restyle Motion",
    description: "Stylized character look with preserved timing.",
    category: "Creative",
    tone: "reference",
  },
  {
    slug: "influencer-street-walk",
    title: "Influencer Street Walk",
    description: "Natural gait and gesture for short-form feeds.",
    category: "AI Influencer",
    tone: "output",
  },
  {
    slug: "runway-turn",
    title: "Runway Turn",
    description: "Fashion turn and pause mapped to a new model identity.",
    category: "Fashion",
    tone: "character",
  },
];
