import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AppProviders } from "@/components/providers/AppProviders";
import { DEFAULT_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const ROOT_TITLE = "Genjutsu AI Video Generator | Motion Transfer & Object Swap";
const ROOT_DESCRIPTION =
  "Genjutsu AI Video Generator — motion transfer and object swap. Upload a character image and reference video to create AI video clips online.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: ROOT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: ROOT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  icons: {
    icon: [{ url: "/genjutsu-icon.jpg", type: "image/jpeg" }],
    apple: [{ url: "/genjutsu-icon.jpg" }],
  },
  openGraph: {
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
    url: SITE_URL,
    images: [
      { url: "/genjutsu-icon.jpg", width: 512, height: 512, alt: "Genjutsu" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
    images: ["/genjutsu-icon.jpg"],
  },
  other: {
    "waffo-verify": "28912b5be58bb3a71254fbc0ca4e87c7",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-fg">
        <AppProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
