import { UseCasePage } from "@/components/seo/UseCasePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Dance Video Generator — Photo to Dance | Genjutsu",
  description:
    "Turn a still character into an AI dance video with motion transfer. Upload an image and a dance reference, then generate in the Genjutsu studio.",
  path: "/dance-video",
  absoluteTitle: true,
  keywords: [
    "ai dance video generator",
    "AI dance video",
    "photo to dance video",
    "motion transfer dance",
  ],
});

export default function DanceVideoPage() {
  return (
    <UseCasePage
      eyebrow="Use case · Dance"
      title="AI Dance Video Generator"
      subtitle="Map choreography from a reference clip onto a still character — an AI dance video without reshooting the performance."
      tags={["Image + dance reference", "Motion transfer", "Short-form"]}
      primaryCta={{ href: "/#studio", label: "Generate dance video" }}
      secondaryCta={{ href: "/examples", label: "See Examples" }}
      demos={[
        { label: "Character still", tone: "character" },
        { label: "Dance reference", tone: "reference" },
        { label: "AI dance video", tone: "output" },
      ]}
      features={[
        {
          title: "Choreography you choose",
          body: "The dance comes from your reference clip, not a prompt guessing footwork.",
        },
        {
          title: "Identity from the still",
          body: "Keep one face and wardrobe across many songs or hooks by freezing the character image.",
        },
        {
          title: "Credits by motion length",
          body: "Trim the reference to the usable phrase so tests stay cheap before you commit.",
        },
      ]}
      sections={[
        {
          heading: "How AI dance video works on Genjutsu",
          paragraphs: [
            "Upload a clear character still and a short dance reference. Genjutsu motion transfer reads pose timing from the clip and applies it to your subject. That is the core of an AI dance video generator workflow: performance in, identity held, clip out.",
            "Results are strongest with readable full-body motion, matched camera height, and a front-facing or three-quarter still. Extreme crops and whip-pan references are the usual failure modes.",
          ],
        },
        {
          heading: "When to use this vs prompt-only video",
          paragraphs: [
            "Use Genjutsu when the steps must match a specific performance — a reel hook, a branded challenge, or a choreographer’s phrase. Use a generative video model when you want invented motion from text and can accept identity drift.",
            "Many creators explore moves elsewhere, then lock the keeper phrase here onto a stable AI influencer still.",
          ],
        },
        {
          heading: "Practical setup",
          paragraphs: [
            "1) Lock identity (see the consistent characters guide). 2) Trim dance audio/visual to the phrase you need. 3) Log in and generate from the homepage studio — the /motion-transfer page is a UI demo only. 4) Iterate crop and still quality before changing songs.",
          ],
        },
      ]}
      faq={[
        {
          q: "Is this an online AI dance video generator?",
          a: "Yes after login. Real renders run in the homepage studio with your credits; marketing demos do not bill or export final video.",
        },
        {
          q: "What reference length works best?",
          a: "Short hooks for testing, longer phrases once identity holds. Credits scale with uploaded motion length.",
        },
        {
          q: "Can I reuse one character across many dances?",
          a: "That is the intended batch pattern: freeze the still, swap only the dance reference.",
        },
      ]}
      related={[
        { href: "/ai-influencer", label: "AI Influencer" },
        { href: "/guides/how-to-create-ai-influencer-videos", label: "Influencer how-to" },
        { href: "/motion-transfer", label: "Motion Transfer" },
        { href: "/ugc-ads", label: "UGC ads" },
      ]}
      ctaTitle="Turn a still into a dance clip"
      ctaBody="Open the studio, upload your character and dance reference, and generate after login."
    />
  );
}
