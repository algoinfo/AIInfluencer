const WAFFO_PENDING_CHECKOUT_KEY = "genjutsu:waffo-pending-checkout";

export interface WaffoPendingCheckout {
  sessionId: string;
  orderMerchantExternalId: string;
  tierId: string;
  createdAt: number;
}

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function isValidWaffoSessionId(value: string | null): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed === "{SESSION_ID}") return false;
  if (trimmed.includes("{") || trimmed.includes("}")) return false;
  return true;
}

export function isValidWaffoOrderRef(value: string | null): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes("{") || trimmed.includes("}")) return false;
  return trimmed.startsWith("genjutsu:");
}

export function saveWaffoPendingCheckout(data: WaffoPendingCheckout): void {
  const store = storage();
  if (!store) return;
  store.setItem(WAFFO_PENDING_CHECKOUT_KEY, JSON.stringify(data));
  store.setItem(
    `waffo-checkout:${data.sessionId}`,
    data.orderMerchantExternalId,
  );
  // Keep a short-lived sessionStorage copy for same-tab flows.
  try {
    sessionStorage.setItem(WAFFO_PENDING_CHECKOUT_KEY, JSON.stringify(data));
    sessionStorage.setItem(
      `waffo-checkout:${data.sessionId}`,
      data.orderMerchantExternalId,
    );
  } catch {
    /* ignore */
  }
}

function readFromStore(
  store: Storage,
  sessionId?: string | null,
): WaffoPendingCheckout | null {
  if (isValidWaffoSessionId(sessionId ?? null)) {
    const legacyExternalId = store.getItem(`waffo-checkout:${sessionId}`);
    const raw = store.getItem(WAFFO_PENDING_CHECKOUT_KEY);
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

  const raw = store.getItem(WAFFO_PENDING_CHECKOUT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WaffoPendingCheckout;
  } catch {
    return null;
  }
}

export function readWaffoPendingCheckout(
  sessionId?: string | null,
): WaffoPendingCheckout | null {
  if (typeof window === "undefined") return null;

  try {
    const fromLocal = readFromStore(window.localStorage, sessionId);
    if (fromLocal) return fromLocal;
  } catch {
    /* fall through */
  }

  try {
    return readFromStore(window.sessionStorage, sessionId);
  } catch {
    return null;
  }
}

export function clearWaffoPendingCheckout(sessionId?: string | null): void {
  if (typeof window === "undefined") return;
  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      store.removeItem(WAFFO_PENDING_CHECKOUT_KEY);
      if (isValidWaffoSessionId(sessionId ?? null)) {
        store.removeItem(`waffo-checkout:${sessionId}`);
      }
    } catch {
      /* ignore */
    }
  }
}
