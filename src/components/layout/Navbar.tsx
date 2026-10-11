"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserAccountMenu } from "@/components/layout/UserAccountMenu";

const navItems = [
  { href: "/pricing", label: "Pricing" },
  { href: "/motion-transfer", label: "Studio" },
  { href: "/examples", label: "Examples" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, user, openAuthModal } = useAuth();

  function goHome(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setOpen(false);
    const onHome = pathname === "/";
    if (onHome) {
      if (window.location.hash) {
        window.history.replaceState(null, "", "/");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/");
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-border bg-[#050506]/90 backdrop-blur-xl"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="page-shell flex h-[72px] items-center justify-between gap-4">
        <Link
          href="/"
          onClick={goHome}
          className="relative z-[60] inline-flex items-center gap-2.5 font-display text-[0.95rem] font-semibold tracking-[0.14em] text-fg sm:text-base"
        >
          <Image
            src="/genjutsu-icon.jpg"
            alt=""
            width={28}
            height={28}
            className="pointer-events-none h-7 w-7 rounded-lg object-cover"
            priority
          />
          GENJUTSU
        </Link>

        <div className="hidden items-center justify-end gap-6 lg:flex">
          <nav className="flex items-center gap-6">
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
          {isLoggedIn && user ? (
            <UserAccountMenu email={user.email} />
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal({ mode: "login" })}
                className="h-9 rounded-lg px-3 text-sm text-fg-muted transition hover:text-fg"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => openAuthModal({ mode: "register" })}
                className="inline-flex h-9 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink transition hover:bg-accent-strong"
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className={[
            "inline-flex h-10 w-10 items-center justify-center rounded-lg border text-fg transition lg:hidden",
            open
              ? "border-white/20 bg-white/[0.06]"
              : "border-white/12 bg-transparent",
          ].join(" ")}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close" : "Menu"}</span>
          <div className="relative h-3.5 w-3.5">
            <span
              className={[
                "absolute left-0 top-[6px] h-px w-3.5 bg-fg transition-transform duration-200",
                open ? "translate-y-0 rotate-45" : "-translate-y-[4px]",
              ].join(" ")}
            />
            <span
              className={[
                "absolute left-0 top-[6px] h-px w-3.5 bg-fg transition-transform duration-200",
                open ? "translate-y-0 -rotate-45" : "translate-y-[4px]",
              ].join(" ")}
            />
          </div>
        </button>
      </div>

      {open ? (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Dismiss menu"
            className="fixed inset-0 top-[72px] z-40 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-50 border-t border-white/[0.06] bg-[#0a0a0c]">
            <div className="page-shell py-3 pb-4">
              <nav className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.025]">
                {navItems.map((item, index) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={[
                        "flex items-center justify-between px-3.5 py-3 text-[0.95rem] font-medium transition-colors",
                        index > 0 ? "border-t border-white/[0.06]" : "",
                        active
                          ? "bg-white/[0.05] text-fg"
                          : "text-fg-muted hover:bg-white/[0.04] hover:text-fg",
                      ].join(" ")}
                    >
                      <span>{item.label}</span>
                      <span className="text-fg-subtle" aria-hidden="true">
                        ›
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-3">
                {isLoggedIn && user ? (
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5">
                    <UserAccountMenu email={user.email} className="w-full" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        openAuthModal({ mode: "login" });
                      }}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-sm font-medium text-fg transition hover:bg-white/[0.07]"
                    >
                      Log in
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        openAuthModal({ mode: "register" });
                      }}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-ink transition hover:bg-accent-strong"
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
