import type { MetadataRoute } from "next";
import { guides } from "@/data/guides";
import { SITE_URL } from "@/lib/seo";

const LAST_MODIFIED = "2026-10-10";

const staticPaths = [
  "/",
  "/guides",
  "/motion-transfer",
  "/dance-video",
  "/ai-influencer",
  "/ugc-ads",
  "/product-video",
  "/examples",
  "/pricing",
  "/genjutsu",
  "/genjutsu-tutorial",
  "/genjutsu-alternatives",
  "/genjutsu-api",
  "/about",
  "/login",
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
