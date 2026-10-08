import type { MetadataRoute } from "next";
import { guides } from "@/data/guides";
import { tools } from "@/data/tools";
import { SITE_URL } from "@/lib/seo";

const LAST_MODIFIED = "2026-10-08";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/motion-transfer",
    "/examples",
    "/tools",
    "/ai-influencer",
    "/pricing",
    "/guides",
    "/login",
    "/account",
    "/genjutsu",
    "/genjutsu-tutorial",
    "/genjutsu-api",
    "/genjutsu-alternatives",
    "/about",
    "/privacy",
    "/terms",
    "/acceptable-use",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: LAST_MODIFIED,
  }));

  const dynamicRoutes = [
    ...tools.map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}`,
      lastModified: LAST_MODIFIED,
    })),
    ...guides.map((guide) => ({
      url: `${SITE_URL}/guides/${guide.slug}`,
      lastModified: LAST_MODIFIED,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
