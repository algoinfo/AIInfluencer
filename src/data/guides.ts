export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  body: string[];
  related?: { href: string; label: string }[];
};

export const guides: Guide[] = [
  {
    slug: "what-is-genjutsu",
    title: "What Is Genjutsu?",
    excerpt:
      "A clear intro to Genjutsu as AI video motion transfer for characters.",
    readTime: "5 min",
    body: [
      "Genjutsu is a way to create AI video by transferring motion from a reference clip onto a character. Instead of inventing movement from text alone, you start with performance you can see.",
      "On genjutsu.online, Genjutsu means the product concept: character + reference video → motion transfer → AI video. It is related to workflows popularized in tools like Higgsfield, but this site is independent and not an official Higgsfield property.",
      "Use Genjutsu when you want controlled movement — dance, fashion walks, gestures — while keeping a recognizable character identity.",
    ],
    related: [
      { href: "/genjutsu", label: "Genjutsu overview" },
      { href: "/motion-transfer", label: "Motion Transfer" },
    ],
  },
  {
    slug: "what-is-ai-motion-transfer",
    title: "What Is AI Motion Transfer?",
    excerpt:
      "How reference video motion maps onto characters, influencers and products.",
    readTime: "6 min",
    body: [
      "AI motion transfer takes the movement in a reference video — timing, pose, camera feel — and applies it to another subject.",
      "Inputs are usually a character image (or consistent identity) and a reference clip. The output is a new video where your character performs that motion.",
      "It sits between static image generation and fully text-driven video: you keep creative control over the performance source.",
    ],
    related: [
      { href: "/motion-transfer", label: "Try the demo" },
      { href: "/examples", label: "Examples" },
    ],
  },
  {
    slug: "how-does-genjutsu-work",
    title: "How Does Genjutsu Work?",
    excerpt: "The four-step pipeline from character to finished AI video.",
    readTime: "6 min",
    body: [
      "1) Choose your character. 2) Add a reference video. 3) Run motion transfer. 4) Review and iterate the AI video.",
      "Strong results come from clean references: readable full-body motion, stable framing, and a character with clear identity cues.",
      "Genjutsu is the motion step — character consistency still depends on how carefully you prepared the subject.",
    ],
    related: [
      { href: "/genjutsu-tutorial", label: "Full tutorial" },
      { href: "/guides/how-to-use-genjutsu", label: "How to use Genjutsu" },
    ],
  },
  {
    slug: "how-to-use-genjutsu",
    title: "How to Use Genjutsu",
    excerpt: "Practical steps to prepare assets and run a motion transfer pass.",
    readTime: "8 min",
    body: [
      "Prepare a character image or AI influencer identity you trust. Then pick a reference video with the exact movement you want.",
      "Upload both into a Genjutsu-style workflow, configure duration and framing if available, and generate.",
      "Improve results by tightening the reference crop, matching camera height, and regenerating with small changes instead of rewriting everything.",
    ],
    related: [
      { href: "/genjutsu-tutorial", label: "Tutorial" },
      { href: "/motion-transfer", label: "Demo UI" },
    ],
  },
  {
    slug: "how-to-create-ai-influencer-videos",
    title: "How to Create AI Influencer Videos",
    excerpt: "Combine consistent characters with Genjutsu motion transfer.",
    readTime: "7 min",
    body: [
      "Create a consistent AI character first — face, style, niche — then use motion transfer for performance clips.",
      "AI influencer video works best when identity is stable across stills before you introduce dance or gesture references.",
      "Genjutsu handles motion; character platforms like AIInfluencer.world help you lock the persona.",
    ],
    related: [
      { href: "/ai-influencer", label: "AI Influencer" },
      { href: "https://aiinfluencer.world", label: "AIInfluencer.world" },
    ],
  },
  {
    slug: "genjutsu-vs-kling",
    title: "Genjutsu vs Kling",
    excerpt: "When to prefer reference-driven motion vs generative video models.",
    readTime: "6 min",
    body: [
      "Kling excels at generating video from prompts and image cues. Genjutsu-style workflows excel when you already have a motion reference you want to preserve.",
      "Choose Genjutsu when choreography or timing must match a clip. Choose Kling when you want broader generative motion from text.",
      "Many creators use both: Kling for exploration, Genjutsu for controlled performance transfer.",
    ],
    related: [
      { href: "/genjutsu-alternatives", label: "Alternatives" },
      { href: "/tools/kling", label: "Kling" },
    ],
  },
  {
    slug: "genjutsu-vs-runway",
    title: "Genjutsu vs Runway",
    excerpt: "Editorial video tools versus character motion transfer focus.",
    readTime: "6 min",
    body: [
      "Runway offers a broad creative video toolkit. Genjutsu focuses on character + reference → motion transfer.",
      "If your priority is a specific performance mapped onto a character, Genjutsu is the sharper mental model.",
      "If you need general editing, restyle and generative video in one suite, Runway may fit better as a complementary tool.",
    ],
    related: [
      { href: "/tools/runway", label: "Runway" },
      { href: "/genjutsu-alternatives", label: "Compare tools" },
    ],
  },
  {
    slug: "genjutsu-alternatives",
    title: "Genjutsu Alternatives",
    excerpt: "Related AI video and motion tools worth comparing.",
    readTime: "7 min",
    body: [
      "Alternatives and neighbors include Kling, Runway, Veo, Seedance and other motion-focused systems.",
      "No single tool wins every use case. Match the tool to whether you need reference fidelity, cinematic restyle or talking avatars.",
      "See the full comparison page for a structured table.",
    ],
    related: [
      { href: "/genjutsu-alternatives", label: "Full comparison" },
      { href: "/tools", label: "Tools" },
    ],
  },
  {
    slug: "best-ai-motion-transfer-tools",
    title: "Best AI Motion Transfer Tools",
    excerpt: "A shortlist of tools that map motion onto characters and scenes.",
    readTime: "8 min",
    body: [
      "Look for tools that accept a character/subject and a motion reference, then output video while preserving identity.",
      "Genjutsu, Seedance and certain Higgsfield workflows are close to this pattern. Broader video models can approximate it with image-to-video.",
      "Evaluate on identity hold, motion fidelity, camera handling and iteration speed.",
    ],
    related: [
      { href: "/tools", label: "Tools" },
      { href: "/motion-transfer", label: "Motion Transfer" },
    ],
  },
  {
    slug: "how-to-create-consistent-ai-characters",
    title: "How to Create Consistent AI Characters",
    excerpt: "Identity locks, sheets and stills before you add motion.",
    readTime: "6 min",
    body: [
      "Consistency starts in stills: multiple angles, stable style prompts and a simple character sheet.",
      "Only after the face and wardrobe read as the same person should you introduce Genjutsu motion transfer.",
      "Reuse the same identity package across every video so motion changes performance, not the person.",
    ],
    related: [
      { href: "/ai-influencer", label: "AI Influencer" },
      { href: "/guides/how-to-create-ai-influencer-videos", label: "Influencer videos" },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
