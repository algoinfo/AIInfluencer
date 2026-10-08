import type { Metadata } from "next";

export const SITE_URL = "https://genjutsu.online";
export const SITE_NAME = "GENJUTSU";
export const SITE_TAGLINE = "AI Video Motion Transfer";
export const CONTACT_EMAIL = "6546272@qq.com";

/** Default site-wide keywords (TDK · K) */
export const DEFAULT_KEYWORDS = [
  "Genjutsu",
  "AI video generator",
  "motion transfer",
  "object swap",
  "AI motion control",
  "character video",
  "AI influencer video",
  "Higgsfield Genjutsu",
  "genjutsu.online",
];

type PageSeo = {
  title: string;
  description: string;
  path: string;
  /** Page-specific keywords; merged with DEFAULT_KEYWORDS */
  keywords?: string[];
  noindex?: boolean;
  /** Skip the root `%s | GENJUTSU` template when the title already includes the brand. */
  absoluteTitle?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
  noindex = false,
  absoluteTitle = false,
}: PageSeo): Metadata {
  const url = `${SITE_URL}${path}`;
  const mergedKeywords = Array.from(
    new Set([...keywords, ...DEFAULT_KEYWORDS]),
  );

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: mergedKeywords,
    robots: noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [
        { url: "/genjutsu-icon.jpg", width: 512, height: 512, alt: SITE_NAME },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/genjutsu-icon.jpg"],
    },
  };
}
