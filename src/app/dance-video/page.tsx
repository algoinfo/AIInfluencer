import { UseCasePage } from "@/components/seo/UseCasePage";
import { WELCOME_CREDITS } from "@/lib/credit-limits";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Dance Video Generator | Genjutsu",
  description: `AI dance video generator: sign up for ${WELCOME_CREDITS} welcome credits, upload a photo and dance reference, generate with motion transfer — then buy packs when you need more.`,
  path: "/dance-video",
  absoluteTitle: true,
  keywords: [
    "ai dance video generator",
    "AI dance video",
    "photo to dance video",
  ],
});

export default function DanceVideoPage() {
  return (
    <UseCasePage
      eyebrow="Use case · Dance"
      title="AI Dance Video Generator"
      subtitle={`Sign up for ${WELCOME_CREDITS} welcome credits, upload a photo and a dance reference, and generate a motion-transfer clip in the studio. Need more runs? Buy a one-time credit pack on Pricing.`}
      features={[
        {
          title: `${WELCOME_CREDITS} welcome credits on signup`,
          body: "New accounts get a starter balance for real studio generations — same pipeline as paid packs, not a dead-end demo.",
        },
        {
          title: "Your choreography, not a prompt guess",
          body: "Motion comes from the dance clip you upload, so footwork timing stays intentional.",
        },
        {
          title: "Buy packs when you scale",
          body: "Welcome credits are for trying the workflow. One-time packs on Pricing never expire when you need more seconds.",
        },
      ]}
      sections={[
        {
          heading: "How the AI dance video generator works",
          paragraphs: [
            `Create an account, receive ${WELCOME_CREDITS} welcome credits, then generate in the homepage studio. Credits scale with motion length, so trim the dance phrase before spending the balance on a long clip.`,
            "Workflow: clear full-body or three-quarter photo → short dance reference → generate. Identity stays on the still; performance stays on the plate. When the starter balance runs out, top up with a Basic or Pro pack.",
          ],
        },
        {
          heading: "Credits: signup bonus, then purchase",
          paragraphs: [
            `Includes with signup: ${WELCOME_CREDITS} welcome credits, access to the production studio, and history for your takes.`,
            "Does not include: unlimited anonymous renders. The /motion-transfer layout page is a UI preview — real generation needs login and credits. Ongoing volume uses one-time packs on Pricing.",
          ],
        },
        {
          heading: "Tips so your first credits produce a postable take",
          paragraphs: [
            "Match camera height between photo and dance. Prefer readable full-body references. Start with a 4–8s hook. If face drifts, fix the still before trying a harder choreography.",
            "UGC ads → /ugc-video-generator. Pet dances → /ai-pet-dance. Avatar talking clips → /avatar-video-generator.",
          ],
        },
      ]}
      faq={[
        {
          q: "How much does it cost to start?",
          a: `Sign up and get ${WELCOME_CREDITS} welcome credits for real studio generations. After that, buy one-time packs on Pricing — credits do not expire.`,
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
          a: "Log in, then open the homepage studio. Related links take you to signup or login first if you are signed out.",
        },
      ]}
      related={[
        { href: "/login", label: "Sign up / Log in" },
        { href: "/pricing", label: "Buy credits" },
        { href: "/ai-pet-dance", label: "AI pet dance" },
        { href: "/ugc-video-generator", label: "UGC video generator" },
        { href: "/guides/how-to-create-ai-influencer-videos", label: "Influencer how-to" },
      ]}
    />
  );
}
