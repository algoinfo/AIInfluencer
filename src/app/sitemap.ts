import type { MetadataRoute } from "next";
import { guides } from "@/data/guides";
import { SITE_URL } from "@/lib/seo";

const LAST_MODIFIED = "2026-10-10";

const staticPaths = [
  "/",
  "/guides",
  "/motion-transfer",
  "/ugc-video-generator",
  "/dance-video",
  "/ai-pet-dance",
  "/avatar-video-generator",
  "/ai-influencer",
  "/product-video",
  "/examples",
  "/pricing",
  "/genjutsu",
  "/genjutsu-tutorial",
  "/genjutsu-alternatives",
  "/genjutsu-api",
  "/about",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPaths.map((path) => ({
      url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
      lastModified: LAST_MODIFIED,
    })),
    ...guides.map((guide) => ({
      url: `${SITE_URL}/guides/${guide.slug}`,
      lastModified: LAST_MODIFIED,
    })),
  ];
}
