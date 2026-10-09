export const homeWhatIs = {
  title: "What is AI motion transfer",
  paragraphs: [
    "AI motion transfer creates a new video from two inputs: a reference image of the subject you want on screen, and a reference video that already contains the movement. The model reads pose, timing, and camera energy from the clip, then applies that motion to your image. The result keeps your character, product, or identity while following the performance in the reference.",
    "Unlike text-only image-to-video, you are not asking a prompt to invent the choreography. Unlike a simple face swap, the goal is full-body timing and camera feel from a real clip. On Genjutsu, that workflow lives in the studio above: upload an image and a motion video, optionally enable a prompt, choose a resolution, and generate. Credits follow the length of the uploaded motion video.",
  ],
};

export type HomeUseCase = {
  id: string;
  title: string;
  href: string;
  paragraphs: string[];
};

export const homeUseCases: HomeUseCase[] = [
  {
    id: "photo-to-dance",
    title: "Turn a Still Image Into a Dance Video",
    href: "/dance-video",
    paragraphs: [
      "Start with a clear still of a person or character, then add a short dance clip as the motion reference. AI motion transfer maps the footwork, arms, and rhythm onto that image so you can produce an AI dance video without reshooting the performance.",
      "Results are strongest with a readable full-body reference and a front-facing still that matches the angle you want. Use this for social reels, music creatives, or quick tests before a live shoot. See the dance video use-case page for the full workflow.",
    ],
  },
  {
    id: "product-in-motion",
    title: "AI Motion Transfer for Product Images",
    href: "/product-video",
    paragraphs: [
      "A pack shot or hero product still is static. With motion transfer—or Object Swap when you mainly need the held item replaced—you can attach that product image to a reference of a turn, hand demo, or lifestyle move.",
      "Keep the product large and clear in both the still and the reference. This is useful for short product loops, landing-page heroes, and UGC-style demos. Browse Examples for look-and-feel inspiration, then generate in the studio with your own assets.",
    ],
  },
  {
    id: "ai-influencer-batch",
    title: "Create AI Influencer Videos at Scale",
    href: "/ai-influencer",
    paragraphs: [
      "Consistent AI influencer videos need a stable identity. Lock a character image you trust, then run many reference performances—walks, gestures, dance, unbox—through the same face and body.",
      "Vary the motion file, not the character sheet, so a week of posts can come from one identity set. Genjutsu’s studio history helps you compare takes in a session. Learn more on the AI Influencer page, then generate from the homepage studio.",
    ],
  },
  {
    id: "film-recast",
    title: "Film-Style Character Recasting",
    href: "/motion-transfer",
    paragraphs: [
      "When blocking and camera move are locked but the on-screen talent needs to change, character motion transfer recasts the performance onto another subject while keeping timing from the reference.",
      "Treat outputs as previz, social cuts, or pitch tools unless you grade and composite further. Clear silhouettes and limited occlusion hold better. Read the motion transfer overview, then try the live studio with your own plate and still.",
    ],
  },
  {
    id: "ecommerce-model",
    title: "AI Virtual Models for Ecommerce",
    href: "/examples",
    paragraphs: [
      "Catalog and fashion teams often need fabric swing, turns, or walk-bys without shooting every SKU on a live model. Upload a lookbook still or digital model, then a walk or turn reference to produce an AI ecommerce video stand-in.",
      "Prefer Motion Transfer when the still is the hero identity; prefer Object Swap when the source video already has a person and you mainly want clothes or a product replaced. Always follow your brand’s disclosure rules for synthetic talent.",
    ],
  },
  {
    id: "ugc-ads",
    title: "Create UGC-Style AI Video Ads",
    href: "/ugc-ads",
    paragraphs: [
      "Performance ads burn through demo and walk-and-talk variants. Reuse a winning camera pattern from a reference clip, then recast it with a new face or product still to create UGC-style AI advertising video without another filming day.",
      "Generation is billed by motion length, so A/B tests stay predictable: same hook length, different images. Check Pricing for packs and welcome credits, then iterate in the studio preview.",
    ],
  },
];

export const homeWhatYouCanCreate = {
  title: "What Can You Create With AI Motion Transfer?",
  intro: "Short-form and catalog-style clips from the same image + motion workflow.",
  items: [
    {
      title: "AI Influencer Videos",
      body: "Keep one identity consistent across many performances.",
      href: "/ai-influencer",
    },
    {
      title: "Dance Videos",
      body: "Map choreography from a reference onto a still character.",
      href: "/dance-video",
    },
    {
      title: "Product Videos",
      body: "Turn a pack shot into a short motion loop or demo.",
      href: "/product-video",
    },
    {
      title: "Fashion Videos",
      body: "Walks, turns, and fabric motion for lookbook-style clips.",
      href: "/ai-influencer",
    },
    {
      title: "UGC Ads",
      body: "Recast a proven camera pattern with a new face or product.",
      href: "/ugc-ads",
    },
    {
      title: "Character Videos",
      body: "Illustrated or digital characters performing real motion.",
      href: "/motion-transfer",
    },
    {
      title: "Ecommerce Videos",
      body: "Virtual model stand-ins for PDP and shoppable creatives.",
      href: "/examples",
    },
  ],
};

export type HomeExample = {
  id: string;
  src: string;
  title: string;
  result: string;
  params: string;
  href: string;
};

export const homeExamples: HomeExample[] = [
  {
    id: "flip",
    src: "/images/studio/lib-flip.jpg",
    title: "Flip",
    result: "Athletic recast from a character still + motion clip.",
    params: "Motion Transfer · 720p",
    href: "/examples",
  },
  {
    id: "cast",
    src: "/images/studio/lib-cast.jpg",
    title: "Recast",
    result: "Same move, new talent from your reference image.",
    params: "Motion Transfer · 720p",
    href: "/examples",
  },
  {
    id: "world",
    src: "/images/studio/lib-world.jpg",
    title: "New world",
    result: "Reference blocking with your character’s look.",
    params: "Motion Transfer · 1080p",
    href: "/examples",
  },
];

/** SEO + product FAQ shown on the homepage (also FAQPage JSON-LD). */
export const homeFaqs = [
  {
    q: "What is Genjutsu?",
    a: "Genjutsu is an AI video tool for motion transfer and object swap. You upload a character or product image and a reference video, then generate a new clip where that subject follows the motion in the reference.",
  },
  {
    q: "How does Genjutsu AI motion transfer work?",
    a: "Upload a reference image and a reference video in the studio. The model applies pose, timing, and camera energy from the clip to your image, then returns a generated video. You can optionally enable a prompt and choose resolution before you run.",
  },
  {
    q: "What images and videos can I upload?",
    a: "Images: JPG, PNG, or WEBP up to 10 MB. Videos: MP4, MOV, or WEBM up to 80 MB. Use a clear subject still and a readable motion clip you have rights to upload.",
  },
  {
    q: "How long can a Genjutsu reference video be?",
    a: "Uploads are capped at 30 seconds. Genjutsu models also require at least 4 seconds. Credits are based on the billable length of the uploaded motion video (rounded up to whole seconds).",
  },
  {
    q: "Can I turn a photo into a dance video?",
    a: "Yes. Use a clear photo as the image and a dance clip as the motion reference. Full-body, well-lit references usually hold better than extreme crops or heavy occlusion.",
  },
  {
    q: "Can I use Genjutsu for product videos?",
    a: "Yes. Use a clean product still with a short demo or turn reference. For replacing an object or outfit inside an existing shot, use the Object Swap tab instead of Motion Transfer.",
  },
  {
    q: "Do I need a prompt?",
    a: "No. Prompt is optional. Leave it off to use the default path (image + video). Turn it on only when you want to steer look, outfit, scene, or what to swap.",
  },
  {
    q: "How much does Genjutsu cost?",
    a: "Sign up includes 50 welcome credits. After that, buy one-time packs on Pricing: Basic $9.9 and Pro $19.9. Credits do not expire.",
  },
  {
    q: "How are credits calculated?",
    a: "Credits follow motion length, not a flat fee per click. Kling-style motion transfer uses 100 credits per second times the model multiplier. Genjutsu Motion Transfer prices by resolution (480p / 720p / 1080p). Object Swap prices by resolution (360p / 540p / 720p). The Generate button shows seconds and credits before you run.",
  },
  {
    q: "Can I use Genjutsu videos commercially?",
    a: "You are responsible for rights to your uploads and for how you publish the output, including likeness, trademarks, and platform rules for synthetic media. Genjutsu provides the generation tool; it does not grant third-party IP. See Terms and Acceptable Use.",
  },
  {
    q: "What is the difference between Genjutsu and Kling Motion Control?",
    a: "On this site, Genjutsu refers to the product and the Genjutsu motion-transfer / object-swap models. Kling Motion Control is a separate model family you can also pick in the studio for wan-motion style generation. Choose Genjutsu models when you want the Genjutsu resolution pricing path; choose Kling when you prefer that model’s look and credit multipliers. genjutsu.online is independent and not affiliated with Kling.",
  },
  {
    q: "What is the difference between Genjutsu and Runway?",
    a: "Runway is a broad creative video suite (generate, restyle, edit). Genjutsu focuses on character or product image plus reference video → motion transfer or object swap. They solve different jobs; this site is not affiliated with Runway.",
  },
  {
    q: "Why was my generation blocked?",
    a: "Prompts and content are screened before a successful video completes. Blocked or unsafe content returns an error. Not enough credits returns a payment required response. Try a clearer still, a shorter well-lit reference, or a different prompt.",
  },
  {
    q: "Why do I need to sign in to generate a video?",
    a: "Generation uses your credit balance and account history. Sign in with email or Google to receive welcome credits and run jobs. Anonymous generation is not available.",
  },
];
