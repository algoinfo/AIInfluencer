"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { StudioHistoryPanel } from "@/components/studio/StudioHistoryPanel";
import { WELCOME_CREDITS } from "@/lib/credit-limits";
import {
  deleteCloudStudioHistory,
  fetchCloudStudioHistory,
  type StudioHistoryItem,
} from "@/lib/studio-history";

export default function AccountPage() {
  const { ready, isLoggedIn, user, openAuthModal, logout } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [creations, setCreations] = useState<StudioHistoryItem[]>([]);
  const [creationsReady, setCreationsReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setCredits(null);
      setCreations([]);
      setCreationsReady(false);
      return;
    }
    let cancelled = false;
    fetch("/api/user/credits", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("credits");
        return (await res.json()) as { credits: number };
      })
      .then((data) => {
        if (!cancelled) setCredits(data.credits);
      })
      .catch(() => {
        if (!cancelled) setCredits(null);
      });

    void fetchCloudStudioHistory(24).then((items) => {
      if (cancelled) return;
      setCreations(items ?? []);
      setCreationsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const openCreation = useCallback((item: StudioHistoryItem) => {
    if (item.status !== "done" || !item.videoUrl) return;
    window.open(item.videoUrl, "_blank", "noopener,noreferrer");
  }, []);

  const downloadCreation = useCallback((item: StudioHistoryItem) => {
    if (item.status !== "done" || !item.videoUrl) return;
    const a = document.createElement("a");
    a.href = item.videoUrl;
    a.download = `genjutsu-${item.id}.mp4`;
    a.rel = "noopener";
    a.target = "_blank";
    a.click();
  }, []);

  const deleteCreation = useCallback((item: StudioHistoryItem) => {
    if (item.status === "generating") return;
    setCreations((prev) => prev.filter((row) => row.id !== item.id));
    void deleteCloudStudioHistory(item.id);
  }, []);

  if (!ready) {
    return (
      <div className="page-shell section-pad pt-28">
        <p className="text-sm text-fg-muted">Loading…</p>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="page-shell section-pad mx-auto max-w-lg pt-28 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Account
        </h1>
        <p className="mt-3 text-sm text-fg-muted">
          Log in to see your credits and manage your Genjutsu account.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => openAuthModal({ mode: "login" })}
            className="inline-flex h-11 items-center rounded-full border border-white/12 px-5 text-sm text-fg transition hover:bg-white/[0.04]"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => openAuthModal({ mode: "register" })}
            className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-[#0a0a0c] transition hover:bg-accent-strong"
          >
            Sign up free
          </button>
        </div>
        <p className="mt-4 text-xs text-fg-subtle">
          New accounts get {WELCOME_CREDITS.toLocaleString()} welcome credits.
        </p>
      </div>
    );
  }

  return (
    <div className="page-shell section-pad mx-auto max-w-2xl pt-28">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Account
      </h1>
      <div className="mt-8 space-y-3 rounded-2xl border border-white/[0.08] bg-surface/60 p-5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-fg-muted">Email</span>
          <span className="truncate text-fg">{user.email}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-fg-muted">Credits</span>
          <span className="tabular-nums text-accent">
            {credits == null ? "…" : credits.toLocaleString("en-US")}
          </span>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-[#0a0a0c] transition hover:bg-accent-strong"
        >
          Buy credits
        </Link>
        <Link
          href="/#studio"
          className="inline-flex h-11 items-center rounded-full border border-white/12 px-5 text-sm text-fg transition hover:bg-white/[0.04]"
        >
          Open studio
        </Link>
        <button
          type="button"
          onClick={() => void logout()}
          className="inline-flex h-11 items-center rounded-full border border-white/12 px-5 text-sm text-fg-muted transition hover:bg-white/[0.04] hover:text-fg"
        >
          Log out
        </button>
      </div>

      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-fg">
              Creations
            </h2>
            <p className="mt-1 text-[0.75rem] text-fg-subtle">
              Cloud history for this account — Ready, Generating, and Failed.
            </p>
          </div>
          {creationsReady ? (
            <span className="text-[0.7rem] tabular-nums text-fg-subtle">
              {creations.length}
            </span>
          ) : null}
        </div>
        {!creationsReady ? (
          <p className="rounded-xl border border-white/[0.08] bg-black/30 px-4 py-8 text-center text-sm text-fg-muted">
            Loading creations…
          </p>
        ) : (
          <StudioHistoryPanel
            items={creations}
            onSelect={openCreation}
            onDownload={downloadCreation}
            onDelete={deleteCreation}
            emptyHint="Generate a video in the studio — it will show up here across devices."
          />
        )}
      </section>
    </div>
  );
}
