import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Examples",
  description:
    "Browse Genjutsu examples — studio swap, fashion, portrait, and motion transfer styles.",
  path: "/examples",
});

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
