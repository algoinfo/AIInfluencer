import { UseCasePage } from "@/components/seo/UseCasePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Influencer Video Generator | Genjutsu",
  description:
    "Create consistent AI influencer videos with character identity plus motion transfer. Reuse one face across walks, dance, and UGC-style performances.",
  path: "/ai-influencer",
  absoluteTitle: true,
  keywords: [
    "AI influencer",
    "AI influencer video generator",
    "AI character video",
    "Genjutsu",
  ],
});

export default function AIInfluencerPage() {
  return (
    <UseCasePage
      eyebrow="Use case · AI influencer"
      title="AI Influencer Video Generator"
      subtitle="Lock a consistent AI character, then bring it to life with motion transfer — walks, dance, and UGC-style performances from one identity."
      tags={["Identity first", "Motion transfer", "Batch content"]}
      primaryCta={{ href: "/#studio", label: "Open Genjutsu studio" }}
      secondaryCta={{
        href: "https://aiinfluencer.world",
        label: "Create character",
        external: true,
      }}
      demos={[
        { label: "Character", tone: "character" },
        { label: "Reference", tone: "reference" },
        { label: "Influencer video", tone: "output" },
      ]}
      features={[
        {
          title: "Identity first",
          body: "Lock a consistent AI character before you introduce dance or gesture references.",
        },
        {
          title: "Genjutsu for motion",
          body: "Use motion transfer so the influencer performs — Genjutsu stays the video engine.",
        },
        {
          title: "Publish-ready volume",
          body: "Iterate short-form videos while keeping the same face, style, and brand feel.",
        },
      ]}
      sections={[
        {
          heading: "The AI influencer stack",
          paragraphs: [
            "Create or import a stable character still, optionally with help from AIInfluencer.world for persona minting. Then run many reference performances — walks, gestures, dance, unbox — through Genjutsu so a week of posts can share one face.",
            "Vary the motion file, not the character sheet. That is how AI influencer video scales without inventing a new cousin every upload.",
          ],
        },
        {
          heading: "Route by content job",
          paragraphs: [
            "Dance-led reels → /dance-video. Paid UGC variants → /ugc-ads. Pack and hold demos → /product-video. Prep identity → /guides/how-to-create-consistent-ai-characters. Full batch how-to → /guides/how-to-create-ai-influencer-videos.",
            "/motion-transfer remains the vocabulary support page; do not treat it as the primary acquisition URL for influencer intent.",
          ],
        },
        {
          heading: "Generate for real",
          paragraphs: [
            "Sign in and use the homepage studio. Credits attach to your account and follow motion length. The demo UI on /motion-transfer only shows upload layout — online generation needs login.",
          ],
        },
      ]}
      faq={[
        {
          q: "Do I need a separate character tool?",
          a: "Optional. Many creators mint stills on AIInfluencer.world or elsewhere, then motion-transfer in Genjutsu. What matters is a locked hero still.",
        },
        {
          q: "Can one influencer cover dance and ads?",
          a: "Yes if the still package covers body for dance and face for close UGC. See the use-case pages for shot-type tips.",
        },
        {
          q: "Where are comparisons to Kling or Runway?",
          a: "On /genjutsu-alternatives — the canonical comparison page. Thin vs-guide URLs redirect there.",
        },
      ]}
      related={[
        { href: "/dance-video", label: "Dance video" },
        { href: "/ugc-ads", label: "UGC ads" },
        { href: "/guides/how-to-create-ai-influencer-videos", label: "How-to guide" },
        { href: "/genjutsu-alternatives", label: "Alternatives" },
      ]}
      ctaTitle="Build the character. Transfer the motion."
      ctaBody="Create or import a locked still, then generate influencer clips in the Genjutsu studio after login."
    />
  );
}
