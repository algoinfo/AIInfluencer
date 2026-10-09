const WAFFO_PENDING_CHECKOUT_KEY = "genjutsu:waffo-pending-checkout";

export interface WaffoPendingCheckout {
  sessionId: string;
  orderMerchantExternalId: string;
  tierId: string;
  createdAt: number;
}

export function isValidWaffoSessionId(value: string | null): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed === "{SESSION_ID}") return false;
  if (trimmed.includes("{") || trimmed.includes("}")) return false;
  return true;
}

export function saveWaffoPendingCheckout(data: WaffoPendingCheckout): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(WAFFO_PENDING_CHECKOUT_KEY, JSON.stringify(data));
  sessionStorage.setItem(
    `waffo-checkout:${data.sessionId}`,
    data.orderMerchantExternalId,
  );
}

export function readWaffoPendingCheckout(
  sessionId?: string | null,
): WaffoPendingCheckout | null {
  if (typeof window === "undefined") return null;

  if (isValidWaffoSessionId(sessionId ?? null)) {
    const legacyExternalId = sessionStorage.getItem(
      `waffo-checkout:${sessionId}`,
    );
    const raw = sessionStorage.getItem(WAFFO_PENDING_CHECKOUT_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as WaffoPendingCheckout;
        if (parsed.sessionId === sessionId) return parsed;
      } catch {
        /* fall through */
      }
    }
    if (legacyExternalId) {
      return {
        sessionId: sessionId as string,
        orderMerchantExternalId: legacyExternalId,
        tierId: "",
        createdAt: 0,
      };
    }
  }

  const raw = sessionStorage.getItem(WAFFO_PENDING_CHECKOUT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WaffoPendingCheckout;
  } catch {
    return null;
  }
}

export function clearWaffoPendingCheckout(sessionId?: string | null): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(WAFFO_PENDING_CHECKOUT_KEY);
  if (isValidWaffoSessionId(sessionId ?? null)) {
    sessionStorage.removeItem(`waffo-checkout:${sessionId}`);
  }
}
