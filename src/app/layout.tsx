import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AppProviders } from "@/components/providers/AppProviders";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Genjutsu AI Video Generator",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Genjutsu AI Video Generator — create AI videos with motion transfer. Upload a character and reference video to generate new clips.",
  icons: {
    icon: [{ url: "/genjutsu-icon.jpg", type: "image/jpeg" }],
    apple: [{ url: "/genjutsu-icon.jpg" }],
  },
  openGraph: {
    title: "Genjutsu AI Video Generator",
    description:
      "Genjutsu AI Video Generator — create AI videos with motion transfer. Upload a character and reference video to generate new clips.",
    siteName: SITE_NAME,
    type: "website",
    url: SITE_URL,
    images: [
      { url: "/genjutsu-icon.jpg", width: 512, height: 512, alt: "Genjutsu" },
    ],
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
