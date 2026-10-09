"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { StudioHistoryPanel } from "@/components/studio/StudioHistoryPanel";
import { Button } from "@/components/ui/Button";
import { WELCOME_CREDITS } from "@/lib/credit-limits";
import {
  fetchUserCredits,
  publishCreditsUpdated,
  waitForCreditsIncrease,
} from "@/lib/credits-client";
import {
  deleteCloudStudioHistory,
  fetchCloudStudioHistory,
  type StudioHistoryItem,
} from "@/lib/studio-history";
import {
  clearWaffoPendingCheckout,
  isValidWaffoOrderRef,
  isValidWaffoSessionId,
  readWaffoPendingCheckout,
} from "@/lib/waffo-checkout-client";

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell section-pad pt-28">
          <p className="text-sm text-fg-muted">Loading…</p>
        </div>
      }
    >
      <AccountPageInner />
    </Suspense>
  );
}

function AccountPageInner() {
  const { ready, isLoggedIn, user, openAuthModal, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [credits, setCredits] = useState<number | null>(null);
  const [creations, setCreations] = useState<StudioHistoryItem[]>([]);
  const [creationsReady, setCreationsReady] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchasePending, setPurchasePending] = useState(false);
  const purchaseHandledRef = useRef(false);
  const creditsBaselineRef = useRef<number | null>(null);

  const applyCredits = useCallback(
    (value: number) => {
      setCredits(value);
      publishCreditsUpdated(value, user?.email);
    },
    [user?.email],
  );

  useEffect(() => {
    if (!isLoggedIn) {
      setCredits(null);
      setCreations([]);
      setCreationsReady(false);
      return;
    }
    let cancelled = false;
    void fetchUserCredits()
      .then((value) => {
        if (cancelled) return;
        creditsBaselineRef.current = value;
        applyCredits(value);
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
  }, [applyCredits, isLoggedIn]);

  useEffect(() => {
    if (!ready || !isLoggedIn || purchaseHandledRef.current) return;

    const purchaseSuccess = searchParams.get("purchase") === "success";
    const sessionIdParam = searchParams.get("session_id");
    const sessionId = isValidWaffoSessionId(sessionIdParam)
      ? sessionIdParam
      : null;
    const orderId = searchParams.get("order_id");
    const orderRefParam = searchParams.get("order_ref");
    const orderRef = isValidWaffoOrderRef(orderRefParam)
      ? orderRefParam
      : null;

    if (!purchaseSuccess && !sessionId && !orderId && !orderRef) return;

    // Wait until we know the pre-purchase balance — otherwise polling can
    // falsely report the existing balance as "Added X credits".
    if (creditsBaselineRef.current == null && credits == null) return;

    const pending = readWaffoPendingCheckout(sessionId);
    const orderMerchantExternalId =
      orderRef ?? pending?.orderMerchantExternalId ?? null;
    const waffoSessionId = sessionId ?? pending?.sessionId ?? null;

    purchaseHandledRef.current = true;
    setPurchaseError(null);
    setPurchaseMessage(null);
    setPurchasePending(true);

    void (async () => {
      const baseline = creditsBaselineRef.current ?? credits ?? 0;

      const finishWithBalance = (
        balanceAfter: number,
        creditsGranted?: number,
        tierName?: string,
      ) => {
        applyCredits(balanceAfter);
        clearWaffoPendingCheckout(waffoSessionId);
        setPurchaseMessage(
          creditsGranted && creditsGranted > 0
            ? `Added ${creditsGranted.toLocaleString("en-US")} credits${tierName ? ` (${tierName})` : ""}.`
            : "Payment complete — credits updated.",
        );
        setPurchasePending(false);
        router.replace("/account");
      };

      if (orderMerchantExternalId || orderId) {
        try {
          const res = await fetch("/api/payments/complete", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: waffoSessionId,
              orderId,
              orderMerchantExternalId,
            }),
          });
          const data = (await res.json()) as {
            ok?: boolean;
            creditsGranted?: number;
            balanceAfter?: number;
            tierName?: string;
            error?: string;
          };
          if (!res.ok || !data.ok) {
            throw new Error(data.error || "Could not apply credits.");
          }
          if (typeof data.balanceAfter === "number") {
            finishWithBalance(
              data.balanceAfter,
              data.creditsGranted,
              data.tierName,
            );
            return;
          }
        } catch (error) {
          console.warn("[account] complete failed, polling credits", error);
        }
      }

      const polled = await waitForCreditsIncrease(baseline, {
        attempts: 12,
        intervalMs: 1500,
      });

      if (polled != null && polled > baseline) {
        // Don't invent a grant amount from the delta — only the complete API
        // knows the pack size. Refresh balance and show a neutral success.
        finishWithBalance(polled);
        return;
      }

      try {
        const latest = await fetchUserCredits();
        applyCredits(latest);
      } catch {
        /* ignore */
      }

      setPurchasePending(false);
      setPurchaseError(
        "Payment received — credits should appear shortly. Refresh if they do not.",
      );
      router.replace("/account");
    })();
  }, [applyCredits, credits, isLoggedIn, ready, router, searchParams]);

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
          <Button
            type="button"
            variant="secondary"
            onClick={() => openAuthModal({ mode: "login" })}
          >
            Log in
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => openAuthModal({ mode: "register" })}
          >
            Sign up free
          </Button>
        </div>
        <p className="mt-4 text-xs text-fg-subtle">
          New accounts get {WELCOME_CREDITS.toLocaleString()} welcome credits.
        </p>
      </div>
    );
  }

  const justPurchased = Boolean(purchaseMessage) || purchasePending;

  return (
    <div className="page-shell section-pad mx-auto max-w-2xl pt-28">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Account
      </h1>
      {purchasePending ? (
        <p className="mt-4 rounded-xl border border-accent/40 bg-accent/15 px-4 py-3 text-sm font-medium text-accent">
          Applying credits…
        </p>
      ) : null}
      {purchaseMessage ? (
        <p className="mt-4 rounded-xl border border-accent/40 bg-accent/15 px-4 py-3 text-sm font-medium text-accent">
          {purchaseMessage}
        </p>
      ) : null}
      {purchaseError ? (
        <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {purchaseError}
        </p>
      ) : null}
      <div className="mt-8 space-y-3 rounded-2xl border border-white/[0.1] bg-surface/70 p-5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-fg-muted">Email</span>
          <span className="truncate text-fg">{user.email}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-fg-muted">Credits</span>
          <span className="text-base font-semibold tabular-nums text-accent">
            {credits == null ? "…" : credits.toLocaleString("en-US")}
          </span>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {justPurchased ? (
          <>
            <Button href="/#studio" variant="primary">
              Open studio
            </Button>
            <Button href="/pricing" variant="secondary">
              Buy more credits
            </Button>
          </>
        ) : (
          <>
            <Button href="/pricing" variant="primary">
              Buy credits
            </Button>
            <Button href="/#studio" variant="secondary">
              Open studio
            </Button>
          </>
        )}
        <Button type="button" variant="ghost" onClick={() => void logout()}>
          Log out
        </Button>
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
