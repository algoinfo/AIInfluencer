import type { MetadataRoute } from "next";
import { guides } from "@/data/guides";
import { SITE_URL } from "@/lib/seo";

const LAST_MODIFIED = "2026-10-08";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: LAST_MODIFIED,
    },
    ...guides.map((guide) => ({
      url: `${SITE_URL}/guides/${guide.slug}`,
      lastModified: LAST_MODIFIED,
    })),
  ];
}
