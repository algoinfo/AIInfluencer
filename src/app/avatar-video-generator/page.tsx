import { UseCasePage } from "@/components/seo/UseCasePage";
import { WELCOME_CREDITS } from "@/lib/credit-limits";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Avatar Video Generator | Genjutsu",
  description:
    "AI avatar video generator via motion transfer: lock a character avatar still, apply a performance reference, and generate consistent avatar clips.",
  path: "/avatar-video-generator",
  absoluteTitle: true,
  keywords: ["avatar video generator", "AI avatar video generator"],
});

export default function AvatarVideoGeneratorPage() {
  return (
    <UseCasePage
      eyebrow="Use case · Avatar"
      title="AI Avatar Video Generator"
      subtitle="Generate avatar videos from a locked character still plus a performance reference — consistent face and body across takes."
      tags={["Avatar still", "Motion transfer", "Consistent identity"]}
      primaryCta={{ href: "#studio", label: "Generate avatar video" }}
      secondaryCta={{ href: "/ai-influencer", label: "AI influencer flow" }}
      features={[
        {
          title: "One avatar, many performances",
          body: "Freeze the still so walks, gestures, and short acts share the same digital talent.",
        },
        {
          title: "Reference-driven motion",
          body: "You choose the performance plate — closer to directed avatar acting than pure text inventing body language.",
        },
        {
          title: "Credits to start",
          body: `${WELCOME_CREDITS} welcome credits on signup for real studio generations.`,
        },
      ]}
      sections={[
        {
          heading: "What this avatar video generator is (and is not)",
          paragraphs: [
            "This page targets AI avatar video generator intent with Genjutsu’s motion-transfer stack: avatar image + motion reference → video. It is not a lip-sync TTS talking-head factory. If you need scripted speech with mouth sync, use a dedicated talking-avatar suite alongside Genjutsu for body performance.",
            "Stay here when consistency of a visual avatar across non-talking performances matters more than reading a script on camera.",
          ],
        },
        {
          heading: "How to generate an avatar clip",
          paragraphs: [
            "1) Lock a hero avatar still (clear face, optional full body). 2) Pick a short performance reference. 3) Log in and generate in the homepage studio. 4) Batch by swapping only the motion file.",
            "For influencer-branded calendars see /ai-influencer. For free photo-to-dance see /dance-video. For ad UGC see /ugc-video-generator.",
          ],
        },
        {
          heading: "Quality bar for avatars",
          paragraphs: [
            "Identity drift usually means the still is soft or over-filtered. Hands and hair fail on fast motion — start with calmer plates. Disclose synthetic avatars where your platform requires it.",
          ],
        },
      ]}
      faq={[
        {
          q: "Does this do lip-sync from a script?",
          a: "No. Genjutsu focuses on motion transfer from a reference video. Pair a talking-head tool if you need speech sync.",
        },
        {
          q: "Can I reuse one avatar across campaigns?",
          a: "Yes — that is the point. Freeze the still; change only the performance reference.",
        },
        {
          q: "Is there a free tier?",
          a: `Signup includes ${WELCOME_CREDITS} welcome credits for studio generations.`,
        },
      ]}
      related={[
        { href: "/ai-influencer", label: "AI influencer" },
        { href: "/ugc-video-generator", label: "UGC video generator" },
        { href: "/dance-video", label: "Free dance video" },
        { href: "/guides/how-to-create-consistent-ai-characters", label: "Consistent characters" },
      ]}
      ctaTitle="Generate an avatar video"
      ctaBody="Open the studio with a locked avatar still and a short performance reference."
    />
  );
}
