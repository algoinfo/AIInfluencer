import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Motion Transfer Examples | Genjutsu",
  description:
    "Browse Genjutsu motion transfer and object swap looks—then open the studio to generate with your own image and reference video.",
  path: "/examples",
  absoluteTitle: true,
  keywords: [
    "Genjutsu examples",
    "motion transfer examples",
    "object swap examples",
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
