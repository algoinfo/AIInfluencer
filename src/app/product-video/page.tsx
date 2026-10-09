import { UseCasePage } from "@/components/seo/UseCasePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Product Video Generator | Genjutsu",
  description:
    "Turn pack shots and hero product stills into short AI product videos with motion transfer or object swap — demos, turns, and lifestyle loops.",
  path: "/product-video",
  absoluteTitle: true,
  keywords: [
    "AI product video",
    "product video generator",
    "AI pack shot video",
    "ecommerce motion transfer",
  ],
});

export default function ProductVideoPage() {
  return (
    <UseCasePage
      eyebrow="Use case · Product"
      title="AI Product Video Generator"
      subtitle="Attach a pack shot or hero still to a turn, hand demo, or lifestyle move — short AI product video without a full reshoot."
      tags={["Pack shot", "Object swap", "Motion transfer"]}
      primaryCta={{ href: "/#studio", label: "Generate product video" }}
      secondaryCta={{ href: "/examples", label: "See Examples" }}
      demos={[
        { label: "Product still", tone: "character" },
        { label: "Demo reference", tone: "reference" },
        { label: "Product clip", tone: "output" },
      ]}
      features={[
        {
          title: "Still stays the hero",
          body: "Motion Transfer keeps your pack shot identity while borrowing timing from the reference.",
        },
        {
          title: "Object Swap when needed",
          body: "If the plate already has hands and motion, swap the held item instead of rebuilding the person.",
        },
        {
          title: "Ecommerce-friendly lengths",
          body: "Trim references to loopable seconds so PDP and ad placements stay light.",
        },
      ]}
      sections={[
        {
          heading: "Motion transfer for product images",
          paragraphs: [
            "A pack shot is static. With Genjutsu you can attach that product image to a reference of a turn, unbox, or lifestyle move and export a short AI product video for landing pages, ads, or catalog tests.",
            "Keep the product large and clear in both the still and the reference. Tiny SKUs in wide lifestyle plates force the model to invent labels and edges.",
          ],
        },
        {
          heading: "Motion Transfer vs Object Swap",
          paragraphs: [
            "Choose Motion Transfer when the still is the hero identity (bottle, device, character holding SKU). Choose Object Swap when the source video already has a person and you mainly want clothes or a product replaced.",
            "Do not flip modes mid-test without changing the brief — each path fails differently when the product is under-framed.",
          ],
        },
        {
          heading: "Production notes",
          paragraphs: [
            "Log in and generate from the homepage studio. Disclose synthetic imagery where your brand or marketplace requires it. For fashion virtual models, see also /ai-influencer and the ecommerce notes on the homepage use-case section.",
          ],
        },
      ]}
      faq={[
        {
          q: "Can I animate a flat pack shot?",
          a: "Yes if the reference supplies readable motion and the product is large in frame. Flat art with no depth cues is harder — use a slightly angled hero still when possible.",
        },
        {
          q: "Will labels stay readable?",
          a: "Not guaranteed. Prefer shorter clips and sharper stills; treat outputs as motion heroes and keep a clean still for PDP zooms.",
        },
        {
          q: "Where should I go for UGC-style product demos?",
          a: "Use /ugc-video-generator when the job is phone-native ad variants; stay here for pack-shot and turntable-style product motion.",
        },
      ]}
      related={[
        { href: "/ugc-video-generator", label: "UGC video generator" },
        { href: "/examples", label: "Examples" },
        { href: "/motion-transfer", label: "Motion Transfer" },
        { href: "/guides/how-to-use-genjutsu", label: "How to use Genjutsu" },
      ]}
      ctaTitle="Put the pack shot in motion"
      ctaBody="Open the studio with a clear product still and a short demo reference, then generate after login."
    />
  );
}
