import { HomePage } from "@/components/home/HomePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Genjutsu AI Video Generator",
  description:
    "Genjutsu AI Video Generator — create AI videos with motion transfer. Upload a character and reference video to generate new clips.",
  path: "/",
});

export default function Home() {
  return <HomePage />;
}
