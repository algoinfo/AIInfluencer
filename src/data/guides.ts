export type GuideSection = {
  heading: string;
  paragraphs: string[];
};

export type GuideFaq = {
  q: string;
  a: string;
};

export type GuideParam = {
  label: string;
  value: string;
};

export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  sections: GuideSection[];
  faq: GuideFaq[];
  params?: GuideParam[];
  related?: { href: string; label: string }[];
};

export const guides: Guide[] = [
  {
    slug: "what-can-genjutsu-do",
    title: "What Can Genjutsu Do? Motion Transfer From One Still + Clip",
    excerpt:
      "Genjutsu turns a character still and a short motion reference into a publishable clip — keep identity, inherit performance. Capabilities, workflow, limits, and pricing on genjutsu.online.",
    readTime: "10 min",
    sections: [
      {
        heading: "Direct answer",
        paragraphs: [
          "Genjutsu is an AI video studio for motion transfer and object swap. You upload a clear still of the subject you want on screen, plus a short reference video that already has the movement. The model reads pose, timing, and camera energy from the clip, then applies that performance to your image.",
          "It is built to multiply channel-ready cuts from assets you already trust — a face sheet, a pack shot, a dance plate — not to invent a brand-new choreography from text alone, and not to replace a full edit suite.",
        ],
      },
      {
        heading: "What Genjutsu can do",
        paragraphs: [
          "Motion Transfer — Upload one character or product still and one reference clip (about 4–30 seconds). Timing and performance come from the video; identity comes from the image.",
          "Object Swap — Keep the person or scene already in a source clip and mainly replace a held product, garment, or visual element.",
          "Resolution choices — Common delivery sizes from lighter previews up to sharper masters, depending on the model path you pick in the studio.",
          "Optional prompt — Leave it off for the default image + video path, or turn it on to steer look, outfit, scene, or what to swap.",
          "Studio history — Successful runs stay in your session history so you can compare takes and download winners without reopening the shoot.",
        ],
      },
      {
        heading: "Why this is different from “just text-to-video”",
        paragraphs: [
          "Pure text-to-video invents motion from a prompt. That helps exploration, but it is weak when you already have an approved take — a dance, a product demo, a camera push that creative signed off.",
          "Genjutsu starts from that take. The reference video is the motion source. The still is the identity. An optional prompt can nudge style, but it does not replace a readable plate. You keep continuity across variants (same walk, same beat) while testing a new face, product, or character for different markets and platforms.",
        ],
      },
      {
        heading: "How a generation pass works",
        paragraphs: [
          "1) Character — Use a sharp JPG/PNG (or WEBP) of the person, pet, avatar, or product you want on screen. Keep the subject large and readable.",
          "2) Motion — Upload a short MP4/MOV/WEBM whose timing you already like. One reference video carries the performance.",
          "3) Mode — Choose Motion Transfer when the still is the hero identity, or Object Swap when you mainly need to replace an item or outfit inside an existing shot.",
          "4) Generate — Credit cost shows before you run (driven by motion length and model). Preview winners in history; iterate the still or plate instead of rewriting everything at once.",
          "Practical brief pattern when you use a prompt: “Keep [motion / camera / performance]. Match [character still]. Change [outfit / scene / product] only if needed. Avoid [anything that must not appear].”",
        ],
      },
      {
        heading: "Motion Transfer vs Object Swap",
        paragraphs: [
          "Motion Transfer — Treat the still as the on-screen talent. Rebuild the performance around that identity. Use when choreography, delivery, or camera move is right in the reference and you need a different person, character, or product hero — for example, one dance plate into three influencer looks.",
          "Object Swap — Change only what you name (SKU, prop, outfit) while keeping more of the source video’s person and framing. Use when the plate is approved and one surface must match a new offer or colorway.",
          "Most creators run Motion Transfer as the main pass for character work, then Object Swap for product cleanup. If both identity and motion are wrong, fix the still or plate first — generation cannot invent a strong take from a weak upload.",
        ],
      },
      {
        heading: "Who Genjutsu is for",
        paragraphs: [
          "Creators and music — One dance or stage reference becomes teasers and Shorts with a locked character still. Performance stays; identity changes per release.",
          "Growth and ads — Recast a proven camera pattern with a new face or pack shot for UGC-style tests without another filming day.",
          "Ecommerce and catalog — Walks, turns, and hand demos from lookbook stills or virtual models when you cannot shoot every SKU live.",
          "Best fit: you already have (or can source) a motion plate worth locking, and a clear still. Poor fit: you need a full NLE, long-form in one render, or a tool that invents motion from text alone.",
        ],
      },
      {
        heading: "Example workflows",
        paragraphs: [
          "Dance reel — Lock a clear full-body still. Run Motion Transfer with a 8–12s dance reference. Keep the same still across three music cuts; only change the motion file.",
          "SKU demo ad — Keep the hand path from an approved product demo. Use Object Swap (or Motion Transfer with a pack-shot still) so packaging updates for a new market while timing stays.",
          "AI influencer batch — Freeze one identity sheet, then feed walks, gestures, and unbox references through the same face. Vary motion, not the character.",
          "These workflows share one rule: lock motion first (or identity first for batch work), then change the other input. If the motion is wrong, fix the plate before spending credits on looks.",
        ],
      },
      {
        heading: "Limits (what Genjutsu will not do)",
        paragraphs: [
          "Not a full NLE — Dialogue, captions, music licensing, and final assembly stay in your editor.",
          "Shot-sized clips only — Uploads are capped around 30 seconds; models also need a minimum length (about 4 seconds). Split longer stories into shots, then assemble winners.",
          "Prompt is optional seasoning — It will not invent clean footwork if the reference is muddy.",
          "Rights stay with you — Clear likeness, music, product, and platform rules for synthetic media before paid spend. Genjutsu provides the generation tool; it does not grant third-party IP. See Terms and Acceptable Use.",
        ],
      },
      {
        heading: "Output specs and pricing",
        paragraphs: [
          "Length: about 4–30 seconds per run, based on the uploaded motion video (billable seconds rounded up).",
          "Inputs: 1 character/product image + 1 motion reference video. Images up to about 10 MB; videos up to about 80 MB.",
          "Billing: credit-based. Kling-style motion transfer uses 100 credits per second times the model multiplier (studio default is often ×1.5). Genjutsu Motion Transfer and Object Swap also price by resolution. The Generate button shows seconds and credits before you run.",
          "Sign up includes welcome credits. After that, buy one-time packs on Pricing — credits do not expire. Failed or blocked runs do not complete a billable success when the studio returns an error before output.",
        ],
      },
      {
        heading: "How to start",
        paragraphs: [
          "1) Sign in on genjutsu.online.",
          "2) Open the homepage studio (or /motion-transfer for the same workflow).",
          "3) Upload a still and a motion reference, pick mode and resolution, then generate.",
          "4) Keep winners in history and iterate one variable at a time — crop, duration, or a cleaner still — instead of reopening the whole brief.",
        ],
      },
    ],
    params: [
      { label: "Inputs", value: "1 still (JPG/PNG/WEBP) + 1 motion video (MP4/MOV/WEBM)" },
      { label: "Modes", value: "Motion Transfer · Object Swap" },
      { label: "Length", value: "~4–30s per shot (credits follow motion length)" },
      { label: "Billing", value: "Credits on screen before generate · packs never expire" },
      { label: "Best still", value: "Clear subject, matched camera height, limited occlusion" },
      { label: "Best reference", value: "Readable motion, stable framing, trimmed dead air" },
    ],
    faq: [
      {
        q: "What can Genjutsu do?",
        a: "Turn a character or product still plus a short reference clip into a new video where that subject follows the motion in the reference. Use Motion Transfer for identity-from-still, or Object Swap to replace items inside an existing shot.",
      },
      {
        q: "Is Genjutsu only a text-to-video tool?",
        a: "No. A prompt can guide look or swap intent, but the studio is built to start from assets you already have: one image for identity and one video for motion.",
      },
      {
        q: "What is the difference between Motion Transfer and Object Swap?",
        a: "Motion Transfer rebuilds the performance around your still as the hero identity. Object Swap keeps more of the source video and mainly replaces a product, garment, or element you name.",
      },
      {
        q: "Can I use Genjutsu videos commercially?",
        a: "You are responsible for rights to uploads and for how you publish the output, including likeness, trademarks, and platform rules for synthetic media. See Terms and Acceptable Use.",
      },
      {
        q: "How does Genjutsu pricing work?",
        a: "Credit-based. Cost follows billable motion length and the model/resolution you pick. The studio shows credits before generate. Welcome credits on signup; then one-time packs that never expire.",
      },
      {
        q: "Do I need to sign in?",
        a: "Yes. Generation uses your credit balance and account history. Anonymous generation is not available.",
      },
    ],
    related: [
      { href: "/#studio", label: "Open studio" },
      { href: "/guides/how-to-use-genjutsu", label: "How to use Genjutsu" },
      { href: "/motion-transfer", label: "Motion Transfer" },
      { href: "/pricing", label: "Pricing" },
      { href: "/examples", label: "Examples" },
    ],
  },
  {
    slug: "how-to-use-genjutsu",
    title: "How to Use Genjutsu (Motion Transfer Studio)",
    excerpt:
      "A practical workflow: prepare a character still, pick a motion reference, set duration-aware credits, generate, and iterate without rewriting the whole shot.",
    readTime: "12 min",
    sections: [
      {
        heading: "What Genjutsu is for",
        paragraphs: [
          "Genjutsu is an AI video motion transfer studio: you upload a character (or product) image and a reference video that already contains the performance you want. The model maps pose, timing, and often camera energy from the clip onto your subject. You are not asking a text prompt to invent choreography from scratch.",
          "Use this when you need controlled movement — dance, walks, gestures, product demos — while keeping a recognizable identity. Start from the homepage studio after signup; packs on Pricing add credits when you scale.",
        ],
      },
      {
        heading: "Before you open the studio",
        paragraphs: [
          "Lock the still first. A sharp, well-lit image with a readable face and body outline beats a stylish but occluded crop. Full-body or three-quarter framing usually transfers better than extreme close-ups when the reference is a dance or walk.",
          "Pick the motion file second. Prefer a short clip with clear silhouettes, stable framing, and a single primary subject. Busy backgrounds, rapid cuts, and heavy occlusion force the model to guess. Match camera height roughly between still and reference — a top-down still with a side-on walk reference is a common failure mode.",
          "Decide whether you need Motion Transfer (identity from the still, motion from the clip) or Object Swap (person/scene already in the video, replace a held item or garment). Mixing those intents mid-test wastes credits.",
        ],
      },
      {
        heading: "Step-by-step in the studio",
        paragraphs: [
          "1) Sign in on genjutsu.online so generation and credit balance are available. The marketing demo on /motion-transfer only shows the upload layout; real renders run from the homepage studio after login.",
          "2) Upload your character or product image. Keep the subject large in frame; avoid tiny figures in wide empty scenes.",
          "3) Upload the reference video. Credits follow the length of this motion clip, so trim dead air before upload when you can.",
          "4) Choose resolution and optional prompt guidance if you need style hints, then generate. Review the preview, then iterate with small changes — crop, duration, or a cleaner still — instead of swapping every variable at once.",
          "5) Save what works in history and reuse the same identity package across new references so performance changes, not the person.",
        ],
      },
      {
        heading: "Studio parameters that actually matter",
        paragraphs: [
          "Motion length drives cost and how much choreography you ask the model to hold. Short hooks (a few seconds) are cheaper for A/B tests; longer walks need cleaner references.",
          "Resolution trades detail for speed and credits. Start at a working resolution to validate identity hold, then up-res once the motion read is right.",
          "Prompt fields are optional seasoning, not a replacement for a good reference. If the dance is wrong, fix the clip — do not write a paragraph hoping the model invents new footwork.",
        ],
      },
      {
        heading: "Quality checklist after the first render",
        paragraphs: [
          "Identity: does the face and wardrobe still read as the same person across the clip? If not, tighten the still (better lighting, less stylization) before changing motion.",
          "Motion fidelity: do peak poses land on the beats you care about? If the reference is muddy, re-export a cleaner source rather than regenerating endlessly.",
          "Camera: if framing drifts oddly, prefer references with fewer whip pans. For product work, keep the item large in both still and plate.",
          "Publish policy: label synthetic talent where your platform or brand guidelines require it — especially for UGC-style ads and ecommerce models.",
        ],
      },
    ],
    params: [
      { label: "Inputs", value: "Character/product image + motion reference video" },
      { label: "Billing", value: "Credits scale with uploaded motion length" },
      { label: "Best still", value: "Clear subject, matched camera height, limited occlusion" },
      { label: "Best reference", value: "Readable full-body motion, stable framing, short trim" },
      { label: "Real generate", value: "Homepage studio after login (not the /motion-transfer UI shell)" },
    ],
    faq: [
      {
        q: "Is the /motion-transfer page a real generator?",
        a: "It is a layout demo. Online generation needs login and runs from the homepage studio so credits and history attach to your account.",
      },
      {
        q: "Why did identity drift between takes?",
        a: "Usually the still is inconsistent or too stylized, or you changed the character image between runs. Freeze one identity package, then only vary the motion file.",
      },
      {
        q: "Can I use text alone instead of a reference video?",
        a: "Genjutsu is built around reference-driven motion. For prompt-first exploration, creators often pair a generative video tool with Genjutsu for the controlled performance pass.",
      },
      {
        q: "What should I try if hands or feet smear?",
        a: "Use a sharper still, a reference with clearer extremities, and a shorter clip. Avoid busy props crossing the silhouette on peak beats.",
      },
    ],
    related: [
      { href: "/#studio", label: "Open studio" },
      { href: "/guides/what-can-genjutsu-do", label: "What Genjutsu can do" },
      { href: "/motion-transfer", label: "Motion Transfer overview" },
      { href: "/dance-video", label: "AI dance videos" },
      { href: "/genjutsu-tutorial", label: "Tutorial" },
    ],
  },
  {
    slug: "how-to-create-ai-influencer-videos",
    title: "How to Create AI Influencer Videos With Motion Transfer",
    excerpt:
      "Build a stable AI influencer identity, then batch walks, dance, and UGC-style performances from one character sheet using Genjutsu motion transfer.",
    readTime: "14 min",
    sections: [
      {
        heading: "Why influencers need motion transfer (not only image-to-video)",
        paragraphs: [
          "AI influencer channels die when every clip looks like a different person. Text-to-video can invent pretty motion, but it rarely holds a locked face, wardrobe, and brand posture across a week of posts. Motion transfer flips the workflow: identity comes from a still (or a small still set), performance comes from real reference clips you choose.",
          "That split is how teams ship volume — one character package, many performances — without reshooting talent for every hook.",
        ],
      },
      {
        heading: "Step 1 — Lock identity before you dance",
        paragraphs: [
          "Create a consistent character first: face, age read, hair, wardrobe rules, and niche lighting. Export a hero still you trust under studio light. Optional: a simple character sheet with front and three-quarter angles.",
          "Do not start with your hardest choreography. Validate that a calm walk or gesture still looks like the same person. Tools like AIInfluencer.world help some creators mint the persona; Genjutsu is the motion engine once the face is locked.",
        ],
      },
      {
        heading: "Step 2 — Build a motion library, not one viral clip",
        paragraphs: [
          "Collect short references by job: walk-and-talk, unbox hands, dance hook, product hold, reaction nod. Trim each to the usable beat. Label files so you can reuse winners.",
          "For AI dance video specifically, prefer full-body references with readable footwork. For UGC ads, prefer phone-native framing and natural gesture over cinematic crane moves.",
        ],
      },
      {
        heading: "Step 3 — Batch in Genjutsu",
        paragraphs: [
          "In the homepage studio (after login), keep the same character image and swap only the reference video between runs. That is the scaling move: performance changes, identity does not.",
          "Review history side by side. Promote clips that hold face and hands; discard takes where the wardrobe melts or the camera invents cuts you did not ask for. Then publish with whatever disclosure your niche requires for synthetic creators.",
        ],
      },
      {
        heading: "Use-case routes on this site",
        paragraphs: [
          "Dance-led social: start at /dance-video. Brand talking-head and hook variants: /ugc-video-generator. Pack shots and held products: /product-video. Persona overview: /ai-influencer. Motion theory support: /motion-transfer.",
          "Those pages are built around jobs-to-be-done keywords. Guides like this one stay instructional; the use-case URLs carry the search intent for generators and workflows.",
        ],
      },
      {
        heading: "Example batch week (realistic parameters)",
        paragraphs: [
          "Monday: validate identity with a 4–6s walk reference at working resolution. Tuesday–Wednesday: three UGC hooks from the same still (phone framing, different gestures). Thursday: one dance phrase for organic reach. Friday: pick winners, optionally regenerate at higher resolution only for keepers.",
          "Typical failure recovery: if Tuesday’s face drifts, stop batching and replace the still before spending Thursday’s dance credits. If hands smear on unbox, shorten the reference and crop tighter on the product — do not “prompt harder.”",
          "Publish checklist: caption disclosure if required, export the take that holds wardrobe color, and archive the motion file name next to the post so you can recreate the series later.",
        ],
      },
      {
        heading: "What “good” looks like in a finished take",
        paragraphs: [
          "Face landmarks stay stable across turns. Wardrobe color does not melt into skin. Feet contact reads on dance peaks. Camera energy matches the plate without inventing hard cuts. Audio from the reference (if you mux later) still syncs to the visual beats you cared about.",
          "If two of those five fail, fix inputs. If four of five pass, ship and move to the next reference — perfectionism on a single clip is how influencer calendars stall.",
        ],
      },
    ],
    params: [
      { label: "Identity input", value: "One locked hero still (optional multi-angle sheet)" },
      { label: "Motion inputs", value: "Library of short references by content job" },
      { label: "Batch rule", value: "Freeze character image; only change the motion file" },
      { label: "Dance tip", value: "Full-body reference + matched camera height" },
      { label: "UGC tip", value: "Phone framing, natural gestures, short hooks" },
      { label: "Validate first", value: "4–6s calm walk before dance or ad batches" },
    ],
    faq: [
      {
        q: "How many credits do influencer batches burn?",
        a: "Credits follow motion length. Keep hooks short for A/B tests; reserve longer walks for proven creatives. See Pricing for pack sizes and welcome credits.",
      },
      {
        q: "Can one still cover dance and talking-head?",
        a: "Often yes if the still shows enough body for dance and a clear face for close gestures. Extreme crops may need a second still for that shot type.",
      },
      {
        q: "Where do I generate for real?",
        a: "Log in and use the homepage studio. The /motion-transfer demo UI does not bill or render final video.",
      },
      {
        q: "How is this different from Kling or Runway?",
        a: "Those tools shine at generative or editorial video. Genjutsu-style motion transfer wins when a specific performance must map onto a fixed influencer identity. See /genjutsu-alternatives for a structured comparison.",
      },
      {
        q: "Should I upscale every test?",
        a: "No. Validate identity and motion at a working resolution, then spend the higher-res pass on keepers only.",
      },
    ],
    related: [
      { href: "/ai-influencer", label: "AI Influencer" },
      { href: "/dance-video", label: "Dance video" },
      { href: "/ugc-video-generator", label: "UGC video generator" },
      { href: "/guides/how-to-create-consistent-ai-characters", label: "Consistent characters" },
      { href: "https://aiinfluencer.world", label: "AIInfluencer.world" },
    ],
  },
  {
    slug: "how-to-create-consistent-ai-characters",
    title: "How to Create Consistent AI Characters Before Motion Transfer",
    excerpt:
      "Identity locks, sheets, and still discipline so Genjutsu changes performance — not the person — across dance, UGC, and product clips.",
    readTime: "11 min",
    sections: [
      {
        heading: "Consistency is a stills problem first",
        paragraphs: [
          "Motion transfer cannot rescue a mushy identity. If two stills already look like cousins instead of the same person, every dance clip will amplify the drift. Treat character consistency as a pre-production gate: only after the face and wardrobe read as one talent should you introduce Genjutsu.",
          "This guide is the prep layer under /ai-influencer and the influencer video how-to. Skip it and you will burn credits debugging “why does she look different?” when the real bug was the sheet.",
        ],
      },
      {
        heading: "Build a minimal character package",
        paragraphs: [
          "Hero portrait: sharp eyes, natural skin texture, brand-correct makeup and hair. Avoid heavy beauty filters that melt under motion.",
          "Body still: three-quarter or full-body with the wardrobe you will reuse. Note shoes and accessories — extremities are where models invent details.",
          "Style rules: write three bullets (palette, era, do-nots). Reuse them whenever you regenerate stills so mid-week posts do not invent a new jacket.",
        ],
      },
      {
        heading: "Stress-test before you scale",
        paragraphs: [
          "Run one calm motion transfer (walk or simple gesture) and one harder clip (dance or fast hands). If identity fails the calm test, do not batch ten dances.",
          "Compare outputs at the same frame times. Drift in eye shape, age, or wardrobe color means freeze a better still — not a longer prompt.",
        ],
      },
      {
        heading: "Hand-off into Genjutsu use cases",
        paragraphs: [
          "Once the package passes, route by job: dance socials → /dance-video, ad variants → /ugc-video-generator, pack and hold demos → /product-video. Keep the same still across those routes when you want one influencer universe.",
          "For tool shopping and “what else exists,” use /genjutsu-alternatives rather than thin vs-pages. Motion vocabulary lives on /motion-transfer as a support page, not the primary acquisition URL.",
        ],
      },
      {
        heading: "Common identity failure modes (and fixes)",
        paragraphs: [
          "Age drift: the still is over-smoothed. Re-export with natural skin texture and less beauty filter.",
          "Wardrobe melt: colors in the still conflict with lighting in the reference. Either match lighting mood or simplify the outfit to flatter shapes.",
          "Hair chaos: flyaways plus fast dance spins. Prefer a tied or simpler hairstyle for the first validated package, then add complexity.",
          "Twin problem: you swapped stills mid-week. Name files `persona_v1_hero.png` and refuse to generate with anything else until v1 is retired on purpose.",
        ],
      },
      {
        heading: "Keeping a package alive for months",
        paragraphs: [
          "Store the hero still, body still, style bullets, and two golden reference clips that always look like “her.” When onboarding a teammate or agency, send that zip — not a Slack screenshot.",
          "When trends change, add a new outfit still rather than regenerating the face. Identity equity compounds; wardrobe can fashion-cycle.",
        ],
      },
    ],
    params: [
      { label: "Minimum package", value: "Hero face still + full/three-quarter body still" },
      { label: "Style lock", value: "3 written rules: palette, wardrobe, do-nots" },
      { label: "Gate test", value: "1 calm motion + 1 hard motion before batching" },
      { label: "Failure signal", value: "Age, eye shape, or wardrobe color drift across takes" },
      { label: "Archive", value: "Zip: stills + style bullets + 2 golden motion clips" },
    ],
    faq: [
      {
        q: "Do I need a full LoRA or fine-tune?",
        a: "Not for Genjutsu’s image + motion workflow. A disciplined still package is enough for many short-form pipelines. Fine-tunes help when you regenerate stills often across tools.",
      },
      {
        q: "Why do hands look wrong even when the face is fine?",
        a: "Hands are hard. Prefer references with visible, unoccluded hands and avoid tiny props crossing fingers on key frames.",
      },
      {
        q: "Can I change outfits often?",
        a: "Yes — treat each outfit as a new still in the package. Do not ask one still to invent a wardrobe the model never saw.",
      },
      {
        q: "Where should I generate after the sheet is ready?",
        a: "Log in and open the homepage studio. Use use-case pages to plan the job; use this guide to keep identity stable.",
      },
      {
        q: "What if the brand wants a seasonal look?",
        a: "Version the package (v1 spring, v2 summer) with explicit stills. Do not mix v1 face with v2 wardrobe mid-batch without a new gate test.",
      },
    ],
    related: [
      { href: "/ai-influencer", label: "AI Influencer" },
      { href: "/guides/how-to-create-ai-influencer-videos", label: "Influencer videos" },
      { href: "/guides/how-to-use-genjutsu", label: "How to use Genjutsu" },
      { href: "/#studio", label: "Open studio" },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
