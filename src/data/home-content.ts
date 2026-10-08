export const homeWhatIs = {
  title: "What is AI motion transfer",
  paragraphs: [
    "AI motion transfer is a way to make a new video without reshooting the performance. You give the model two things: a still of the character you want on screen, and a reference clip that already has the movement. The generator reads pose, timing, camera energy, and body language from the video, then recasts that motion onto your character. The result is a clip where the person (or product, or influencer identity) looks like yours, while the dance, walk, gesture, or camera move follows the reference.",
    "Unlike text-to-video, you are not hoping a prompt invents the choreography. Unlike a simple face swap, you are not pasting a head onto frames and hoping the neck holds. Motion transfer is reference-driven: the source video is the director, the image is the cast. Upload a JPG or PNG of the subject, upload an MP4 or MOV of the motion, optionally add a short prompt, pick a resolution, and generate. Credits follow the length of the uploaded motion video (rounded up to the next second, maximum 30 seconds). Genjutsu motion transfer needs a clip of at least four seconds.",
    "On genjutsu.online, that workflow lives in the studio above this article. Motion Transfer maps a character onto a performance. Object Swap uses the same inputs to reimagine objects, outfits, or scene elements while keeping camera move and timing. Both are built for creators who already know the shot they want — they just need a different face, body, brand, or product in it.",
  ],
};

export const homeUseCases = [
  {
    id: "photo-to-dance",
    title: "Turn a still photo into a dance video",
    href: "/guides/how-to-create-ai-influencer-videos",
    body: "You have one strong portrait — a phone photo, a studio head-and-shoulders, or an illustrated character — and a dance clip you like. AI motion transfer copies the footwork, arms, and rhythm onto that person so you get a vertical or landscape performance without booking a studio day. Keep the reference short and readable: full body in frame, stable lighting, four to fifteen seconds. Pair it with a character image that matches the angle you want (front-facing stills usually hold identity better than extreme profiles). Fashion, music, and social teams use this to test choreography on a talent before the real shoot, or to ship a reel the same afternoon the still was taken.",
  },
  {
    id: "product-in-motion",
    title: "Make a product image move",
    href: "/examples#cast",
    body: "A pack shot or hero product still is static by nature. With motion transfer or object swap, you attach that product to a reference video of hands turning a bottle, a model walking a bag, or a camera orbit around a table. The output is UGC-style motion without a full product video crew. Use a clean product crop as the image, and a clip where the object stays large enough in frame. This is useful for Amazon-style lifestyle loops, TikTok unboxings, and landing-page heroes that need to feel filmed. Generation length follows the reference, so a six-second turntable costs six billable seconds at your chosen resolution.",
  },
  {
    id: "ai-influencer-batch",
    title: "Batch AI influencer content from one identity",
    href: "/ai-influencer",
    body: "AI influencer programs fail when every clip looks like a different person. Motion transfer lets you lock a face and body from a character sheet, then run many reference performances — walks, talks-with-hands, dance, unbox — through the same identity. You get a week of posts from one still set instead of a new photoshoot each time. Keep the character image consistent (same outfit family, same lighting) and vary only the motion file. Genjutsu’s studio history keeps session outputs so you can compare takes. Credits are per second of motion, so batching ten eight-second clips is a known cost, not a surprise invoice after a long render.",
  },
  {
    id: "film-recast",
    title: "Film-style recast: keep the camera, change the actor",
    href: "/motion-transfer",
    body: "Editors and directors often need a stand-in: the blocking and camera move are locked, but the on-screen talent cannot appear. Motion transfer recasts the performance onto another character while preserving timing. It is not a finishing-grade VFX suite, and you should treat outputs as previz, social cuts, or pitch tools unless you grade and composite further. For best hold, use a reference with clear silhouette and avoid heavy occlusion. Resolution options (480p, 720p, 1080p on Genjutsu models) let you draft cheap at 480p and upscale the take you keep. Pair this with a prompt only when you must steer wardrobe or scene notes; otherwise the default path is image + video.",
  },
  {
    id: "ecommerce-model",
    title: "Ecommerce model stand-in for apparel and beauty",
    href: "/examples#world",
    body: "Catalog teams need motion — fabric swing, three-quarter turns, walk-bys — but cannot shoot every SKU on a model. Upload a lookbook still of the garment or a digital model, then a walk or turn reference. The generated clip shows the product in motion for PDP modules, shoppable ads, and size-inclusive stand-ins when a live model is not available. Object Swap is the better tab when the source video already has a person and you mainly want clothes or a product replaced. Motion Transfer is better when the still is the hero identity. Keep clips under 30 seconds; longer files are rejected. Always follow your brand’s disclosure rules when the talent is synthetic.",
  },
  {
    id: "ugc-ads",
    title: "UGC-style ads without a new filming day",
    href: "/pricing",
    body: "Performance ads burn through talking-head and demo variants. Motion transfer lets a brand reuse a winning camera pattern — handheld kitchen demo, sidewalk walk-and-talk energy — with a new face or a new product still. Produce several recasts from one reference instead of briefing five creators. Sign up includes 10 welcome credits; generation is billed by motion length (base motion-transfer rate is 100 credits per second times the model multiplier; Genjutsu models price by resolution). That makes A/B tests predictable: same 8-second hook, three characters, three charges. Link winning cuts out of the studio preview, then iterate only the image or the prompt.",
  },
];

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
    title: "Flip — athletic recast",
    result:
      "A character still plus an acrobatic reference; output follows the flip timing and landing.",
    params: "Motion Transfer · genjutsu · 720p · ~8s · character JPG + motion MP4",
    href: "/examples#flip",
  },
  {
    id: "cast",
    src: "/images/studio/lib-cast.jpg",
    title: "Recast — same move, new talent",
    result:
      "Identity comes from the image; choreography and camera come from the reference clip.",
    params: "Motion Transfer · genjutsu · 720p · ~6s · optional prompt off",
    href: "/examples#cast",
  },
  {
    id: "world",
    src: "/images/studio/lib-world.jpg",
    title: "New world — scene-aware motion",
    result:
      "Reference blocking stays; wardrobe and location read as the uploaded character’s world.",
    params: "Motion Transfer · genjutsu · 1080p · ~10s · custom prompt on",
    href: "/examples#world",
  },
  {
    id: "swap",
    src: "/images/studio/lib-cast.jpg",
    title: "Object Swap — product in the same shot",
    result:
      "Keep camera and hands; swap the held object or outfit using a product still as the image.",
    params: "Object Swap · 720p · ≥4s source · 1 reference image",
    href: "/examples#cast",
  },
];

export const homeFaqs = [
  {
    q: "What is Genjutsu AI Video Generator?",
    a: "Genjutsu is an AI motion transfer video generator: you upload a character image and a reference video, and it recasts that motion onto your subject. Use Motion Transfer for character performance and Object Swap to change products, clothes, or objects while keeping camera movement. The studio on this page is the working tool — not a waitlist demo.",
  },
  {
    q: "What do I upload?",
    a: "A character or product image (JPG, PNG, or WEBP, up to 10 MB) and a motion or source video (MP4, MOV, or WEBM, up to 80 MB). Credits are calculated from the uploaded video length. For Genjutsu models, the clip must be at least 4 seconds and no longer than 30 seconds.",
  },
  {
    q: "How long can the reference video be?",
    a: "Maximum 30 seconds. Longer files are rejected. Duration is read from the file and billed in whole seconds (rounded up). Genjutsu Object Swap and the Genjutsu motion-transfer model also require at least 4 seconds. Output length follows the prepared source clip.",
  },
  {
    q: "How do free credits work?",
    a: "New accounts get 10 welcome credits after sign up (email or Google). You must be logged in to generate. After the welcome balance, buy one-time packs on Pricing: Basic $9.9, Creator $19.9, and Pro $69. Credits do not expire. Packs add bonus credits on top of the dollar-to-credit base rate (1 credit = $0.001).",
  },
  {
    q: "How are credits calculated?",
    a: "Credits follow motion length, not a flat fee per click. Kling-style motion transfer in the studio uses 100 credits per second times the model multiplier (×1.0 / ×1.2 / ×1.5). Genjutsu models (Motion Transfer genjutsu and Object Swap) price by resolution: 480p, 720p, or 1080p, with studio markup on Higgsfield’s per-second cost. The Generate button shows seconds and credits before you run.",
  },
  {
    q: "Can I use the videos commercially?",
    a: "You are responsible for the rights to every image and video you upload, and for how you publish the output (talent likeness, music, trademarks, platform disclosure for synthetic media). Genjutsu provides the generation tool; it does not grant you third-party IP. Read Terms (/terms) and Acceptable Use (/acceptable-use) before you run ads or sell footage. If a face is not yours to license, do not upload it.",
  },
  {
    q: "How is this different from Higgsfield or Runway?",
    a: "Higgsfield Genjutsu is an upstream model family (motion transfer and object swap APIs) that this site can call when you pick the genjutsu model or the Object Swap tab. Runway is a broader editorial video suite (generate, restyle, edit) and is not the same as a character-plus-reference recast. genjutsu.online is an independent product: studio, credits, and guides focused on that recast workflow. We are not affiliated with Higgsfield or Runway. See /genjutsu-alternatives and the Guides pages Genjutsu vs Kling and Genjutsu vs Runway.",
  },
  {
    q: "Do I need a prompt?",
    a: "No. Prompt is a switch. Off uses the default motion-transfer prompt (or an empty prompt for Genjutsu APIs). On reveals a text box for look, outfit, scene, or what to swap. If the switch is off, generation does not send your custom text.",
  },
  {
    q: "What resolutions and models can I pick?",
    a: "Motion Transfer defaults to the genjutsu model with 480p / 720p / 1080p. You can also choose Kling V3 Pro, V3 Standard, or V2.6 Standard (fal wan-motion path) with credit multipliers. Object Swap does not offer a model menu; it always calls Higgsfield object-swap at your selected resolution, default 720p.",
  },
  {
    q: "Why was my generation blocked or why did login appear?",
    a: "Generate requires an account. Prompts are screened before the model runs; blocked text returns an error and is not charged as a successful video. Not enough credits returns a 402 with the amount required. Content that fails safety checks will not complete. Check Pricing to top up, or try a clearer still and a shorter, well-lit reference clip.",
  },
];
