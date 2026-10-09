import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Motion Transfer Examples | Genjutsu",
  description:
    "Browse Genjutsu motion transfer examples, then generate with your own image and reference video in the on-page studio. FAQ for Flip, Recast, and more.",
  path: "/examples",
  absoluteTitle: true,
  keywords: [
    "Genjutsu examples",
    "motion transfer examples",
    "AI motion transfer examples",
    "AI video demos",
  ],
});

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
