import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/seo";

const product = [
  { href: "/#studio", label: "Studio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/ugc-video-generator", label: "UGC video generator" },
  { href: "/dance-video", label: "Free dance video" },
  { href: "/ai-pet-dance", label: "AI pet dance" },
  { href: "/avatar-video-generator", label: "Avatar video" },
  { href: "/ai-influencer", label: "AI Influencer" },
  { href: "/product-video", label: "Product video" },
];

const learn = [
  { href: "/genjutsu", label: "What is Genjutsu?" },
  { href: "/genjutsu-tutorial", label: "Tutorial" },
  { href: "/genjutsu-api", label: "API" },
  { href: "/genjutsu-alternatives", label: "Alternatives" },
  { href: "/guides", label: "Guides" },
];

const company = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/acceptable-use", label: "Acceptable Use" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-soft">
      <div className="page-shell flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-display text-lg font-semibold tracking-[0.16em]"
          >
            <Image
              src="/genjutsu-icon.jpg"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-lg object-cover"
            />
            GENJUTSU
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            Genjutsu AI Video Generator — motion transfer from a reference
            video to any character.
          </p>
        </div>

        <div className="flex flex-wrap gap-12">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-fg-subtle">
              Product
            </p>
            <ul className="space-y-2">
              {product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-fg-subtle">
              Learn
            </p>
            <ul className="space-y-2">
              {learn.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-fg-subtle">
              Company
            </p>
            <ul className="space-y-2">
              {company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="page-shell flex flex-col gap-2 py-5 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 GENJUTSU · genjutsu.online</span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="transition-colors hover:text-fg"
            >
              {CONTACT_EMAIL}
            </a>
            <span>Independent site · Not affiliated with Higgsfield</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
