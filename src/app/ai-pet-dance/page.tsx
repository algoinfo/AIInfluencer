import { UseCasePage } from "@/components/seo/UseCasePage";
import { petDanceTemplates } from "@/data/pet-dance-templates";
import { WELCOME_CREDITS } from "@/lib/credit-limits";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Pet Dance Generator — 12 Dance Templates | Genjutsu",
  description:
    "AI pet dance generator: upload a dog or cat photo, pick from 12+ dance templates, and create a shareable pet dance video with motion transfer.",
  path: "/ai-pet-dance",
  absoluteTitle: true,
  keywords: ["ai pet dance", "AI pet dance generator", "pet dance video"],
});

export default function AiPetDancePage() {
  return (
    <UseCasePage
      eyebrow="Use case · Pet dance"
      title="AI Pet Dance Generator"
      subtitle="Upload a clear pet photo, pick one of 12 dance templates, and generate a shareable AI pet dance video — niche motion transfer, not a generic people tool."
      features={[
        {
          title: "12+ named dance templates",
          body: "Concrete styles on-page (robot, shuffle, disco, challenge pack…) — the differentiator niche SERPs reward, not vague “AI magic.”",
        },
        {
          title: "Built for animal silhouettes",
          body: "Full-body pet stills hold better than cropped faces. Tips call out paws, tails, and floor margin.",
        },
        {
          title: "Free credits to try",
          body: `New accounts get ${WELCOME_CREDITS} welcome credits for real studio renders after login.`,
        },
      ]}
      templatesHeading="12 pet dance templates"
      templates={[...petDanceTemplates]}
      sections={[
        {
          heading: "Why a dedicated AI pet dance page",
          paragraphs: [
            "SERP for pet dance is won by small, focused sites that show templates and animal-specific tips — not by a generic “AI video” homepage. This URL stays on one job: make your pet dance.",
            "Genjutsu runs the same motion-transfer engine as human dance clips: pet photo + dance motion (template style or your own clip) → vertical-ready output.",
          ],
        },
        {
          heading: "How to use a template",
          paragraphs: [
            "1) Pick a template name above (e.g. Robot paws). 2) Use a matching short dance reference — your clip or a rights-cleared plate in that style. 3) Upload a well-lit, centered, full-body pet photo. 4) Generate in the homepage studio after login.",
            "Best inputs: pet fills the frame, paws visible, little motion blur in the still. Busy carpets and extreme wide shots waste credits.",
          ],
        },
        {
          heading: "Pets we see work well",
          paragraphs: [
            "Dogs and cats are the primary path. Other animals can work when the silhouette is clear and the template motion is simple (slow sway, happy wag). Complex multi-pet scenes are out of scope for v1 of this landing.",
            "Human free dance intent stays on /dance-video. UGC ads on /ugc-video-generator. Talking avatars on /avatar-video-generator.",
          ],
        },
      ]}
      faq={[
        {
          q: "How is this different from a people dance generator?",
          a: "Copy, templates, and tips are pet-specific (silhouette, paws, floor margin). The engine is motion transfer; the page is a niche entry point.",
        },
        {
          q: "Are the 12 templates downloadable files?",
          a: "They are named style packs for this workflow. In studio you pair your pet photo with a motion clip that matches the template energy.",
        },
        {
          q: "Is AI pet dance free?",
          a: `Signup includes ${WELCOME_CREDITS} welcome credits. Short template phrases stretch that balance further than long clips.`,
        },
        {
          q: "Dogs and cats only?",
          a: "Primary. Clear single-subject pets beyond that can work; start with a simple template like Slow sway.",
        },
      ]}
      related={[
        { href: "/dance-video", label: "Free dance (people)" },
        { href: "#studio", label: "Studio" },
        { href: "/login", label: "Start free" },
        { href: "/examples", label: "Examples" },
      ]}
    />
  );
}
