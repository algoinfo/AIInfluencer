import { UseCasePage } from "@/components/seo/UseCasePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI UGC Video Generator | Genjutsu",
  description:
    "AI UGC video generator for creator-style ads: recast a phone-native performance onto a new face or product still with motion transfer — no reshoot day.",
  path: "/ugc-video-generator",
  absoluteTitle: true,
  keywords: ["ai ugc video generator", "AI UGC video generator"],
});

export default function UgcVideoGeneratorPage() {
  return (
    <UseCasePage
      eyebrow="Use case · UGC"
      title="AI UGC Video Generator"
      subtitle="Make creator-style UGC ads from a still + a real phone-native performance. Keep the hook timing; swap the face or product."
      tags={["One keyword focus", "Motion transfer", "Ad variants"]}
      primaryCta={{ href: "/#studio", label: "Generate UGC video" }}
      secondaryCta={{ href: "/pricing", label: "Credits & pricing" }}
      demos={[
        { label: "Talent / product still", tone: "character" },
        { label: "UGC performance", tone: "reference" },
        { label: "UGC ad output", tone: "output" },
      ]}
      features={[
        {
          title: "Performance you already trust",
          body: "The camera pattern and gestures come from your reference clip — not a random AI actor inventing timing.",
        },
        {
          title: "Identity from your still",
          body: "Lock a spokesperson or product image, then batch hook variants without booking another creator day.",
        },
        {
          title: "Credits by motion length",
          body: "Same hook length, different stills — A/B costs stay comparable while you hunt ROAS.",
        },
      ]}
      sections={[
        {
          heading: "What this AI UGC video generator does",
          paragraphs: [
            "An AI UGC video generator usually means “make creator-style ads without a full shoot.” Genjutsu’s path is reference-driven: upload a talent or product still, upload a UGC-style performance (walk-and-talk, unbox, demo), and motion transfer maps that performance onto your subject.",
            "That is different from prompt-only avatar tools that invent a talking head from a script. Here the job is fidelity to a plate you already know converts — then recast it for new SKUs, faces, or angles.",
          ],
        },
        {
          heading: "How to generate a UGC ad in the studio",
          paragraphs: [
            "1) Sign up or log in (new accounts get welcome credits). 2) Prefer 9:16 phone framing in the reference. 3) Keep the product or face large in the still. 4) Generate from the homepage studio — not the layout demo on /motion-transfer. 5) Iterate stills first; only change the plate when the hook is proven.",
            "Use Object Swap when the plate already has hands and you mainly need the held product replaced. Use Motion Transfer when the still is the hero identity.",
          ],
        },
        {
          heading: "When Genjutsu is the right UGC tool",
          paragraphs: [
            "Choose this page’s workflow when you have (or can film once) a winning camera pattern and need volume from new faces or products. Choose a talking-avatar suite when you need lip-sync scripts with no motion plate at all.",
            "Stay on this URL for the query “AI UGC video generator.” Dance free-tier intent lives on /dance-video; pet niche on /ai-pet-dance; talking avatars on /avatar-video-generator.",
          ],
        },
      ]}
      faq={[
        {
          q: "Is this a free AI UGC video generator?",
          a: "New accounts get 50 welcome credits to run real generations after login. Ongoing volume uses one-time credit packs on Pricing — we do not claim unlimited anonymous free renders.",
        },
        {
          q: "Do I need to hire UGC creators?",
          a: "Not for recast variants. Film or license one strong plate, then regenerate with new stills. Always follow platform disclosure rules for synthetic talent.",
        },
        {
          q: "Can the real product stay in frame?",
          a: "Yes when the still or Object Swap path keeps the SKU large and readable. Tiny products in wide lifestyle plates usually fail label clarity.",
        },
        {
          q: "Where do I start?",
          a: "Log in → homepage studio → upload still + UGC reference → generate. This landing page is the SEO entry; the studio is the product.",
        },
      ]}
      related={[
        { href: "/#studio", label: "Studio" },
        { href: "/pricing", label: "Pricing" },
        { href: "/dance-video", label: "Free dance video" },
        { href: "/avatar-video-generator", label: "Avatar video" },
        { href: "/guides/how-to-use-genjutsu", label: "How to use Genjutsu" },
      ]}
      ctaTitle="Generate your next UGC variant"
      ctaBody="Open the studio with a phone-native reference and a locked still. Welcome credits cover your first tests after signup."
    />
  );
}
