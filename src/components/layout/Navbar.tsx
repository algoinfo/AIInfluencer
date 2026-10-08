"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserAccountMenu } from "@/components/layout/UserAccountMenu";

const navItems = [
  { href: "/pricing", label: "Pricing" },
  { href: "/guides", label: "Guides" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, user, openAuthModal } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-border bg-[#050506]/80 backdrop-blur-xl"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="page-shell grid h-[72px] grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 font-display text-[0.95rem] font-semibold tracking-[0.14em] text-fg sm:text-base"
        >
          <Image
            src="/genjutsu-icon.jpg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-lg object-cover"
            priority
          />
          GENJUTSU
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "text-sm transition-colors duration-200",
                  active ? "text-fg" : "text-fg-muted hover:text-fg",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center justify-end gap-2 lg:flex">
          {isLoggedIn && user ? (
            <UserAccountMenu email={user.email} />
          ) : (
            <>
              <button
                type="button"
                onClick={() => openAuthModal({ mode: "login" })}
                className="h-9 rounded-full px-3 text-sm text-fg-muted transition hover:text-fg"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => openAuthModal({ mode: "register" })}
                className="inline-flex h-9 items-center rounded-full bg-accent px-4 text-sm font-semibold text-[#0a0a0c] transition hover:bg-accent-strong"
              >
                Sign up
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-full border border-border-strong text-fg lg:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex w-4 flex-col gap-1.5">
            <span
              className={[
                "h-px w-full bg-fg transition-transform",
                open ? "translate-y-[3.5px] rotate-45" : "",
              ].join(" ")}
            />
            <span
              className={[
                "h-px w-full bg-fg transition-transform",
                open ? "-translate-y-[3.5px] -rotate-45" : "",
              ].join(" ")}
            />
          </div>
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-[#050506]/98 backdrop-blur-xl lg:hidden">
          <div className="page-shell flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-base text-fg-muted transition-colors hover:bg-white/[0.04] hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-white/[0.06] pt-3">
              {isLoggedIn && user ? (
                <div className="px-3 py-1">
                  <UserAccountMenu email={user.email} className="w-full" />
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openAuthModal({ mode: "login" });
                    }}
                    className="rounded-xl px-3 py-3 text-left text-base text-fg-muted transition hover:bg-white/[0.04] hover:text-fg"
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openAuthModal({ mode: "register" });
                    }}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-[#0a0a0c]"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
