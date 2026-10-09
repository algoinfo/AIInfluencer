import { UseCasePage } from "@/components/seo/UseCasePage";
import { WELCOME_CREDITS } from "@/lib/credit-limits";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free AI Dance Video Generator | Genjutsu",
  description: `Free AI dance video generator to start: sign up for ${WELCOME_CREDITS} welcome credits, upload a photo and dance reference, and generate with motion transfer.`,
  path: "/dance-video",
  absoluteTitle: true,
  keywords: ["free ai dance video generator", "free AI dance video generator"],
});

export default function DanceVideoPage() {
  return (
    <UseCasePage
      eyebrow="Use case · Free dance"
      title="Free AI Dance Video Generator"
      subtitle={`Start free with ${WELCOME_CREDITS} welcome credits — upload a photo, add a dance reference, and generate a real motion-transfer clip in the studio.`}
      tags={["Free to start", "Photo → dance", "Welcome credits"]}
      primaryCta={{ href: "#studio", label: "Generate free dance" }}
      secondaryCta={{ href: "/login", label: "Start free" }}
      features={[
        {
          title: `${WELCOME_CREDITS} free credits on signup`,
          body: "Create an account and run real generations — not a watermark-only tease with no render path.",
        },
        {
          title: "Your choreography, not a prompt guess",
          body: "Motion comes from the dance clip you upload, so footwork timing stays intentional.",
        },
        {
          title: "Same free studio as paid",
          body: "Welcome credits use the production motion-transfer pipeline. Packs on Pricing only when you scale past the free balance.",
        },
      ]}
      sections={[
        {
          heading: "How the free AI dance video generator works",
          paragraphs: [
            "Competitors crowd the SERP with “free, no signup” claims. Genjutsu’s free path is honest: sign up, receive welcome credits, generate in the homepage studio. Credits scale with motion length, so trim the dance phrase before you burn the free balance on a 30s clip.",
            "Workflow: clear full-body or three-quarter photo → short dance reference → generate. Identity stays on the still; performance stays on the plate.",
          ],
        },
        {
          heading: "What “free” includes (and what it does not)",
          paragraphs: [
            `Includes: account signup, ${WELCOME_CREDITS} welcome credits, access to the same studio used for paid packs, history for your takes.`,
            "Does not include: unlimited anonymous renders, or pretending the /motion-transfer layout demo exports video. That page is a UI preview; free generation needs login.",
          ],
        },
        {
          heading: "Tips so free credits produce a postable take",
          paragraphs: [
            "Match camera height between photo and dance. Prefer readable full-body references. Start with a 4–8s hook. If face drifts, fix the still before trying a harder choreography.",
            "This page targets free AI dance video generator intent only. UGC ads → /ugc-video-generator. Pet dances → /ai-pet-dance. Avatar talking clips → /avatar-video-generator.",
          ],
        },
      ]}
      faq={[
        {
          q: "Is the AI dance video generator really free?",
          a: `Yes to start: new accounts receive ${WELCOME_CREDITS} welcome credits for real studio generations. After that, buy one-time packs — credits do not expire.`,
        },
        {
          q: "Do I need to sign up?",
          a: "Yes. Anonymous generation is not available. Signup unlocks welcome credits and history.",
        },
        {
          q: "Can I upload my own dance, not a template?",
          a: "Yes — that is the default. Upload any dance reference you have rights to use.",
        },
        {
          q: "Where do I generate?",
          a: "Log in, then open the homepage studio. Start Free takes you to signup/login first.",
        },
      ]}
      related={[
        { href: "/login", label: "Start free" },
        { href: "/pricing", label: "Pricing" },
        { href: "/ai-pet-dance", label: "AI pet dance" },
        { href: "/ugc-video-generator", label: "UGC video generator" },
        { href: "/guides/how-to-create-ai-influencer-videos", label: "Influencer how-to" },
      ]}
      ctaTitle="Start your free dance video"
      ctaBody={`Sign up for ${WELCOME_CREDITS} welcome credits, then generate photo-to-dance in the studio.`}
    />
  );
}
