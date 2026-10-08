import { DiscoverClient } from "@/components/discover/DiscoverClient";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Discover AI Influencers",
  description:
    "Explore trending AI influencers, digital models and virtual creators.",
  path: "/discover",
  keywords: ["Discover AI Influencers", "Genjutsu"],
});

export default function DiscoverPage() {
  return <DiscoverClient />;
}
