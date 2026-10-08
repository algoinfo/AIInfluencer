import { VideoCreator } from "@/components/video/VideoCreator";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Create AI Influencer Videos",
  description:
    "Create AI influencer videos with your character and a reference video. Motion transfer for consistent AI character video.",
  path: "/video",
  keywords: ["Create AI Influencer Videos", "Genjutsu"],
});

export default function VideoPage() {
  return <VideoCreator />;
}
