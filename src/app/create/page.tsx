import { CharacterBuilder } from "@/components/create/CharacterBuilder";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Create Your AI Influencer",
  description:
    "Build a consistent AI influencer from an image or description. Save Character, Character Sheet and Character Identity.",
  path: "/create",
});

export default function CreatePage() {
  return <CharacterBuilder />;
}
