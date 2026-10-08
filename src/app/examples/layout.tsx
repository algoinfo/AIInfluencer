import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Motion Library",
  description:
    "Browse Genjutsu Motion Library examples — studio swap, fashion, portrait, and motion transfer styles.",
  path: "/examples",
});

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
