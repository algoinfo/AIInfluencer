"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  CREDITS_UPDATED_EVENT,
  type CreditsUpdatedDetail,
  fetchUserCredits,
  getCachedCredits,
  publishCreditsUpdated,
} from "@/lib/credits-client";

function displayNameFromEmail(email: string) {
  const local = email.split("@")[0] ?? email;
  return local.length > 14 ? `${local.slice(0, 12)}…` : local;
}

function formatCredits(credits: number) {
  return credits.toLocaleString("en-US");
}

export function UserAccountMenu({
  email,
  className = "",
}: {
  email: string;
  className?: string;
}) {
  const { logout } = useAuth();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(() =>
    getCachedCredits(email),
  );

  const name = displayNameFromEmail(email);
  const compactLabel =
    credits == null ? name : `${formatCredits(credits)} · ${name}`;

  useEffect(() => {
    const cached = getCachedCredits(email);
    if (cached != null) setCredits(cached);

    let cancelled = false;
    void fetchUserCredits()
      .then((value) => {
        if (cancelled) return;
        setCredits(value);
        publishCreditsUpdated(value, email);
      })
      .catch(() => {
        if (!cancelled) setCredits(null);
      });

    return () => {
      cancelled = true;
    };
  }, [email]);

  useEffect(() => {
    const onCreditsUpdated = (event: Event) => {
      const detail = (event as CustomEvent<CreditsUpdatedDetail>).detail;
      if (!detail || typeof detail.credits !== "number") return;
      if (detail.email && detail.email !== email) return;
      setCredits(detail.credits);
    };
    window.addEventListener(CREDITS_UPDATED_EVENT, onCreditsUpdated);
    return () => {
      window.removeEventListener(CREDITS_UPDATED_EVENT, onCreditsUpdated);
    };
  }, [email]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 max-w-[11rem] items-center gap-1.5 overflow-hidden rounded-full border border-white/12 bg-white/[0.04] px-3 text-sm text-fg transition hover:border-white/20 hover:bg-white/[0.07]"
      >
        <span className="min-w-0 flex-1 truncate text-left" title={email}>
          {credits == null ? `··· · ${name}` : compactLabel}
        </span>
        <span className="shrink-0 text-xs text-fg-subtle" aria-hidden="true">
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#111114] shadow-xl"
        >
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block w-full px-3 py-2.5 text-left text-sm text-fg transition hover:bg-white/[0.05]"
          >
            Account
          </Link>
          <Link
            href="/pricing"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block w-full px-3 py-2.5 text-left text-sm text-fg transition hover:bg-white/[0.05]"
          >
            Buy credits
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              void logout();
            }}
            className="block w-full px-3 py-2.5 text-left text-sm text-fg transition hover:bg-white/[0.05]"
          >
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}
