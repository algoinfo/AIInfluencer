import { HomePage } from "@/components/home/HomePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Genjutsu AI Video Generator — Motion Transfer & Object Swap",
  description:
    "Create AI videos with Genjutsu: motion transfer and object swap. Upload a character image and reference video, pick resolution, and generate online.",
  path: "/",
  keywords: [
    "AI video generator",
    "motion transfer AI",
    "object swap AI",
    "Genjutsu online",
    "AI character video",
  ],
});

export default function Home() {
  return <HomePage />;
}
