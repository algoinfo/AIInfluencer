"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export function PricingCheckoutButton({
  tierId,
  tierName,
  highlight,
}: {
  tierId: string;
  tierName: string;
  highlight?: boolean;
}) {
  const { isLoggedIn, openAuthModal } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      openAuthModal({ mode: "login", reason: "nav" });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId }),
      });
      const data = (await res.json()) as {
        checkoutUrl?: string;
        error?: string;
      };
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Could not start checkout.");
      }
      window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => void handleCheckout()}
        disabled={loading}
        className={[
          "inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition disabled:opacity-60",
          highlight
            ? "bg-accent text-[#0a0a0c] hover:bg-accent-strong"
            : "border border-white/12 text-fg hover:bg-white/[0.04]",
        ].join(" ")}
      >
        {loading ? "Redirecting…" : `Get ${tierName}`}
      </button>
      {error ? (
        <p className="mt-2 text-center text-xs text-red-300">{error}</p>
      ) : null}
    </div>
  );
}
