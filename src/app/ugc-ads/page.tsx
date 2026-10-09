import { UseCasePage } from "@/components/seo/UseCasePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI UGC Video Generator for Ads | Genjutsu",
  description:
    "Create UGC-style AI advertising video with motion transfer. Recast a proven camera pattern onto a new face or product still for fast ad variants.",
  path: "/ugc-ads",
  absoluteTitle: true,
  keywords: [
    "ai ugc video generator",
    "UGC AI video",
    "AI advertising video",
    "UGC-style ads",
  ],
});

export default function UgcAdsPage() {
  return (
    <UseCasePage
      eyebrow="Use case · UGC ads"
      title="AI UGC Video Generator"
      subtitle="Reuse a winning phone-native performance, then recast it with a new face or product still — UGC-style AI ads without another filming day."
      tags={["UGC framing", "Ad variants", "Motion transfer"]}
      primaryCta={{ href: "/#studio", label: "Generate UGC ad" }}
      secondaryCta={{ href: "/pricing", label: "View pricing" }}
      demos={[
        { label: "Talent / product still", tone: "character" },
        { label: "UGC reference", tone: "reference" },
        { label: "Ad variant", tone: "output" },
      ]}
      features={[
        {
          title: "Keep the hook, swap the face",
          body: "Camera pattern and gesture timing stay in the reference; identity comes from your still.",
        },
        {
          title: "Predictable test costs",
          body: "Credits follow motion length, so A/B hooks of the same duration stay comparable.",
        },
        {
          title: "Built for volume",
          body: "Batch variants from one locked still and a library of short UGC references.",
        },
      ]}
      sections={[
        {
          heading: "What “AI UGC video generator” means here",
          paragraphs: [
            "Performance ads burn through walk-and-talk and demo variants. Genjutsu acts as an AI UGC video generator by transferring motion from a real UGC-style clip onto a new character or product image — not by inventing a random talking head from a slogan alone.",
            "Prefer phone framing, natural gestures, and short hooks. Cinematic crane references rarely match Meta/TikTok placement energy.",
          ],
        },
        {
          heading: "Workflow for media buyers and creators",
          paragraphs: [
            "1) Export a winning organic or paid clip as the motion plate. 2) Prepare a compliant talent or product still. 3) Generate in the studio after login. 4) Ship variants with the disclosure rules your brand requires for synthetic or AI-assisted creatives.",
            "Object Swap helps when the plate already has a person and you mainly need the held product replaced; Motion Transfer helps when the still is the hero identity.",
          ],
        },
        {
          heading: "Related jobs on Genjutsu",
          paragraphs: [
            "Influencer-led always-on content → /ai-influencer. Dance hooks → /dance-video. Pack-shot motion → /product-video. Tool comparisons → /genjutsu-alternatives.",
          ],
        },
      ]}
      faq={[
        {
          q: "Can I run this for paid social at scale?",
          a: "Yes as a creative production step. Always follow platform and brand rules for synthetic talent and claims.",
        },
        {
          q: "Why not only use text-to-video for UGC?",
          a: "Text models invent motion; they often break a locked spokesperson look. Motion transfer keeps the performance you already know converts.",
        },
        {
          q: "Where do credits show up?",
          a: "After login in account/studio. Welcome credits and packs are on Pricing.",
        },
      ]}
      related={[
        { href: "/pricing", label: "Pricing" },
        { href: "/ai-influencer", label: "AI Influencer" },
        { href: "/product-video", label: "Product video" },
        { href: "/guides/how-to-use-genjutsu", label: "How to use Genjutsu" },
      ]}
      ctaTitle="Ship the next UGC variant"
      ctaBody="Log in, drop a still and a phone-native reference into the studio, and iterate hooks by motion length."
    />
  );
}
