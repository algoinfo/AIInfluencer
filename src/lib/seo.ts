import type { Metadata } from "next";

export const SITE_URL = "https://genjutsu.online";
export const SITE_NAME = "GENJUTSU";
export const SITE_TAGLINE = "AI Video Motion Transfer";
export const CONTACT_EMAIL = "6546272@qq.com";

type PageSeo = {
  title: string;
  description: string;
  path: string;
};

export function pageMetadata({ title, description, path }: PageSeo): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
