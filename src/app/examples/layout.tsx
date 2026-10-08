import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Examples — Motion Transfer & Object Swap",
  description:
    "Browse Genjutsu examples: studio swap, fashion, portrait, and motion transfer styles before you generate.",
  path: "/examples",
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
