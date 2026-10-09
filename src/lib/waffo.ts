import {
  WaffoPancake,
  verifyWebhook,
  WebhookEventType,
  type WebhookEvent,
  type WebhookEventData,
} from "@waffo/pancake-ts";
import { getPricingTier, PRICING_TIERS } from "@/data/pricing";
import {
  completeTierPurchase,
  completeTierPurchaseByEmail,
  refundTierPurchaseByProviderRef,
} from "@/lib/user-credits";

const TIER_PRODUCT_ENV: Record<string, { test: string; live: string }> = {
  basic: { test: "WAFFO_PRODUCT_BASIC", live: "WAFFO_LIVE_PRODUCT_BASIC" },
  pro: { test: "WAFFO_PRODUCT_PRO", live: "WAFFO_LIVE_PRODUCT_PRO" },
};

/** Built-in Genjutsu store SKUs — env vars override when set. */
const DEFAULT_WAFFO_PRODUCTS: Record<
  string,
  { test: string; live: string }
> = {
  basic: {
    test: "PROD_1wcYVpb77RV0zctF5IZ2wv",
    live: "PROD_3fOQPTe2WXUN4PZATyonl3",
  },
  pro: {
    test: "PROD_0Z1YfExeKuEaWTob4ljfBZ",
    live: "PROD_63MQDIn6gAG8n5Fz2PVogG",
  },
};

const KNOWN_TEST_PRODUCT_IDS = new Set(
  Object.values(DEFAULT_WAFFO_PRODUCTS).map((p) => p.test),
);
const KNOWN_LIVE_PRODUCT_IDS = new Set(
  Object.values(DEFAULT_WAFFO_PRODUCTS).map((p) => p.live),
);

export type WaffoEnvironment = "test" | "prod";

export function getWaffoEnvironment(): WaffoEnvironment {
  const value = process.env.WAFFO_ENVIRONMENT?.trim().toLowerCase();
  if (value === "prod" || value === "production") return "prod";
  if (value === "test") return "test";
  if (process.env.VERCEL_ENV === "production") return "prod";
  return "test";
}

export function isWaffoConfigured(): boolean {
  return (
    !!process.env.WAFFO_MERCHANT_ID?.trim() &&
    !!process.env.WAFFO_PRIVATE_KEY?.trim()
  );
}

let client: WaffoPancake | null = null;

export function getWaffoClient(): WaffoPancake {
  const merchantId = process.env.WAFFO_MERCHANT_ID?.trim();
  const privateKey = process.env.WAFFO_PRIVATE_KEY?.trim();
  if (!merchantId || !privateKey) {
    throw new Error("WAFFO_MERCHANT_ID / WAFFO_PRIVATE_KEY are not configured.");
  }
  if (!client) {
    client = new WaffoPancake({
      merchantId,
      privateKey,
      environment: getWaffoEnvironment(),
    });
  }
  return client;
}

function readProductId(envKey: string): string | null {
  const value = process.env[envKey]?.trim();
  return value || null;
}

export type WaffoProductResolution = {
  productId: string;
  environment: WaffoEnvironment;
  source: "env-live" | "env-test" | "default-live" | "default-test";
};

/**
 * Resolve the Waffo product for the active API environment.
 * Rejects known test SKUs when environment=prod (and the reverse), even if
 * mis-copied into WAFFO_LIVE_PRODUCT_* / WAFFO_PRODUCT_*.
 */
export function resolveWaffoProduct(
  tierId: string,
): WaffoProductResolution | null {
  const keys = TIER_PRODUCT_ENV[tierId];
  const defaults = DEFAULT_WAFFO_PRODUCTS[tierId];
  if (!keys || !defaults) return null;

  const environment = getWaffoEnvironment();
  if (environment === "prod") {
    const liveEnv = readProductId(keys.live);
    if (liveEnv && !KNOWN_TEST_PRODUCT_IDS.has(liveEnv)) {
      return { productId: liveEnv, environment, source: "env-live" };
    }
    // Allow WAFFO_PRODUCT_* only when it is a live SKU (common Vercel setup).
    const productEnv = readProductId(keys.test);
    if (
      productEnv &&
      !KNOWN_TEST_PRODUCT_IDS.has(productEnv) &&
      (KNOWN_LIVE_PRODUCT_IDS.has(productEnv) || !liveEnv)
    ) {
      return { productId: productEnv, environment, source: "env-test" };
    }
    return {
      productId: defaults.live,
      environment,
      source: "default-live",
    };
  }

  const testEnv = readProductId(keys.test);
  if (testEnv && !KNOWN_LIVE_PRODUCT_IDS.has(testEnv)) {
    return { productId: testEnv, environment, source: "env-test" };
  }
  return {
    productId: defaults.test,
    environment,
    source: "default-test",
  };
}

export function getWaffoProductId(tierId: string): string | null {
  return resolveWaffoProduct(tierId)?.productId ?? null;
}

export function getTierIdForWaffoProduct(productId: string): string | null {
  for (const tier of PRICING_TIERS) {
    const keys = TIER_PRODUCT_ENV[tier.id];
    const defaults = DEFAULT_WAFFO_PRODUCTS[tier.id];
    if (!keys || !defaults) continue;
    if (
      readProductId(keys.test) === productId ||
      readProductId(keys.live) === productId ||
      defaults.test === productId ||
      defaults.live === productId
    ) {
      return tier.id;
    }
  }
  return null;
}

export function isWaffoCheckoutEnabled(tierId: string): boolean {
  return isWaffoConfigured() && !!getWaffoProductId(tierId);
}

export interface WaffoCheckoutSession {
  sessionId: string;
  checkoutUrl: string;
  orderMerchantExternalId: string;
}

export async function createWaffoCheckout(input: {
  tierId: string;
  productId: string;
  userId: string;
  email: string;
  successUrl: string;
}): Promise<WaffoCheckoutSession> {
  const orderMerchantExternalId = `genjutsu:${input.userId}:${input.tierId}:${Date.now()}`;

  const successUrl = new URL(input.successUrl);
  successUrl.searchParams.set("order_ref", orderMerchantExternalId);

  const result = await getWaffoClient().checkout.authenticated.create({
    productId: input.productId,
    currency: "USD",
    buyerIdentity: input.userId,
    buyerEmail: input.email,
    successUrl: successUrl.toString(),
    metadata: {
      tierId: input.tierId,
      userId: input.userId,
    },
    orderMerchantExternalId,
  });

  return {
    sessionId: result.sessionId,
    checkoutUrl: result.checkoutUrl,
    orderMerchantExternalId,
  };
}

interface WaffoOrderLookup {
  id: string;
  status: string;
  productId?: string | null;
  orderMerchantExternalId?: string | null;
  merchantProvidedBuyerIdentity?: string | null;
  metadata?: Record<string, string> | string | null;
  onetimeProduct?: { id?: string | null; name?: string | null } | null;
}

function getWaffoStoreId(): string {
  const storeId = process.env.WAFFO_STORE_ID?.trim();
  if (!storeId) {
    throw new Error("WAFFO_STORE_ID is not configured.");
  }
  return storeId;
}

function parseOrderMetadata(
  raw: WaffoOrderLookup["metadata"],
): Record<string, string> {
  if (!raw) return {};
  if (typeof raw === "object") {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === "string") out[key] = value;
    }
    return out;
  }
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string") out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

/** Parse `genjutsu:{userId}:{tierId}:{timestamp}` merchant external ids. */
export function parseGenjutsuOrderRef(externalId: string | null | undefined): {
  userId: string;
  tierId: string;
} | null {
  if (!externalId) return null;
  const match = externalId
    .trim()
    .match(/^genjutsu:([a-f0-9-]{36}):([a-z0-9_-]+):(\d+)$/i);
  if (!match) return null;
  return { userId: match[1], tierId: match[2] };
}

async function queryWaffoOrderByExternalId(
  externalId: string,
): Promise<WaffoOrderLookup | null> {
  const result = await getWaffoClient().graphql.query<{
    onetimeOrders?: WaffoOrderLookup[];
  }>({
    query: `query ($storeId: String!, $ref: String!) {
      onetimeOrders(
        storeId: $storeId
        filter: { orderMerchantExternalId: { eq: $ref } }
        limit: 5
      ) {
        id
        status
        orderMerchantExternalId
        merchantProvidedBuyerIdentity
        metadata
        onetimeProduct { id name }
      }
    }`,
    variables: { storeId: getWaffoStoreId(), ref: externalId },
  });

  if (result.errors?.length) {
    console.error("[waffo/complete] external lookup errors", result.errors);
  }

  return result.data?.onetimeOrders?.[0] ?? null;
}

async function queryWaffoOrderById(
  orderId: string,
): Promise<WaffoOrderLookup | null> {
  const result = await getWaffoClient().graphql.query<{
    onetimeOrder?: WaffoOrderLookup | null;
  }>({
    query: `query ($id: String!) {
      onetimeOrder(id: $id) {
        id
        status
        orderMerchantExternalId
        merchantProvidedBuyerIdentity
        metadata
        onetimeProduct { id name }
      }
    }`,
    variables: { id: orderId },
  });

  if (result.errors?.length) {
    console.error("[waffo/complete] id lookup errors", result.errors);
  }

  return result.data?.onetimeOrder ?? null;
}

function isWaffoOrderPaid(status: string | undefined): boolean {
  const normalized = status?.trim().toLowerCase();
  return (
    normalized === "completed" ||
    normalized === "paid" ||
    normalized === "succeeded"
  );
}

function resolveTierIdFromOrder(order: WaffoOrderLookup): string | null {
  const metadata = parseOrderMetadata(order.metadata);
  if (metadata.tierId?.trim()) return metadata.tierId.trim();

  const fromRef = parseGenjutsuOrderRef(order.orderMerchantExternalId);
  if (fromRef?.tierId) return fromRef.tierId;

  const productId = order.onetimeProduct?.id ?? order.productId ?? null;
  if (productId) return getTierIdForWaffoProduct(productId);
  return null;
}

export async function resolveWaffoPurchase(input: {
  orderId?: string | null;
  orderMerchantExternalId?: string | null;
  expectedUserId: string;
}): Promise<{ tierId: string; providerRef: string }> {
  let order: WaffoOrderLookup | null = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    if (input.orderId) {
      order = await queryWaffoOrderById(input.orderId);
    }
    if (!order && input.orderMerchantExternalId) {
      order = await queryWaffoOrderByExternalId(input.orderMerchantExternalId);
    }

    console.log("[waffo/complete] order lookup", {
      attempt: attempt + 1,
      orderId: input.orderId,
      orderMerchantExternalId: input.orderMerchantExternalId,
      found: !!order,
      status: order?.status,
    });

    if (order && isWaffoOrderPaid(order.status)) break;
    if (attempt < 4) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (!order) {
    throw new Error("Order not found yet. Please refresh in a moment.");
  }
  if (!isWaffoOrderPaid(order.status)) {
    throw new Error("Payment is not completed yet. Please refresh in a moment.");
  }

  const metadata = parseOrderMetadata(order.metadata);
  const metadataUserId =
    metadata.userId?.trim() ||
    order.merchantProvidedBuyerIdentity?.trim() ||
    parseGenjutsuOrderRef(order.orderMerchantExternalId)?.userId ||
    null;
  if (metadataUserId && metadataUserId !== input.expectedUserId) {
    throw new Error("This payment belongs to a different account.");
  }

  const tierId = resolveTierIdFromOrder(order);
  if (!tierId) {
    throw new Error("Unknown product for this payment.");
  }

  return { tierId, providerRef: order.id };
}

export function verifyWaffoWebhook(
  payload: string,
  signature: string | null,
): WebhookEvent {
  return verifyWebhook(payload, signature, {
    environment: getWaffoEnvironment(),
  });
}

function isOrderCompletedEvent(eventType: string): boolean {
  const normalized = eventType.trim().toLowerCase();
  return (
    normalized === WebhookEventType.OrderCompleted ||
    normalized === "order.completed"
  );
}

function tierIdFromProductName(name: string | null | undefined): string | null {
  const normalized = name?.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === "basic" || normalized.includes("basic")) return "basic";
  if (normalized === "pro" || normalized.includes("pro")) return "pro";
  return null;
}

export function parseWaffoOrderCompleted(
  event: WebhookEvent,
): {
  providerRef: string;
  tierId: string;
  userId: string | null;
  userEmail: string | null;
} | null {
  if (!isOrderCompletedEvent(String(event.eventType ?? ""))) {
    console.log("[waffo/webhook] skip non-order-completed", {
      eventType: event.eventType,
    });
    return null;
  }

  const data = event.data as WebhookEventData & {
    orderMetadata?: Record<string, string> | string | null;
    productId?: string | null;
  };

  const metadata = parseOrderMetadata(data.orderMetadata ?? null);
  const fromRef = parseGenjutsuOrderRef(data.orderMerchantExternalId);

  const resolvedTierId =
    metadata.tierId?.trim() ||
    fromRef?.tierId ||
    (typeof metadata.productId === "string"
      ? getTierIdForWaffoProduct(metadata.productId)
      : null) ||
    (data.productId ? getTierIdForWaffoProduct(data.productId) : null) ||
    tierIdFromProductName(data.productName);

  const userId =
    metadata.userId?.trim() ||
    data.merchantProvidedBuyerIdentity?.trim() ||
    fromRef?.userId ||
    null;
  const userEmail = data.buyerEmail?.trim().toLowerCase() || null;
  const providerRef = data.orderId?.trim();

  const isWaffoDashboardTest =
    /\[TEST\]/i.test(String(data.productName ?? "")) ||
    /\[TEST\]/i.test(String(data.orderMerchantExternalId ?? "")) ||
    userEmail === "test-webhook@waffo.com";

  console.log("[waffo/webhook] parse fields", {
    eventType: event.eventType,
    providerRef,
    resolvedTierId,
    userId,
    userEmail,
    orderMerchantExternalId: data.orderMerchantExternalId,
    productName: data.productName,
    metadataKeys: Object.keys(metadata),
    isWaffoDashboardTest,
  });

  if (isWaffoDashboardTest) {
    console.log(
      "[waffo/webhook] Waffo dashboard verification ping — no credits (not a real purchase)",
    );
    return null;
  }

  if (!providerRef || !resolvedTierId) return null;
  if (!userId && !userEmail) return null;

  return {
    providerRef,
    tierId: resolvedTierId,
    userId,
    userEmail,
  };
}

export type WaffoWebhookProcessResult = {
  action:
    | "ignored"
    | "unknown_tier"
    | "granted"
    | "already_granted"
    | "refunded"
    | "already_refunded"
    | "refund_payment_missing";
  eventType: string;
  tierId?: string;
  tierName?: string;
  providerRef?: string;
  userId?: string | null;
  userEmail?: string | null;
  creditsGranted?: number;
  creditsRevoked?: number;
  balanceAfter?: number;
};

function isRefundSucceededEvent(eventType: string): boolean {
  const normalized = eventType.trim().toLowerCase();
  return (
    normalized === WebhookEventType.RefundSucceeded ||
    normalized === "refund.succeeded"
  );
}

async function processOrderCompletedEvent(
  event: WebhookEvent,
): Promise<WaffoWebhookProcessResult> {
  const parsed = parseWaffoOrderCompleted(event);
  if (!parsed) {
    console.log("[waffo/webhook] ignored (order.completed missing fields)", {
      deliveryId: event.id,
      eventType: event.eventType,
    });
    return { action: "ignored", eventType: event.eventType };
  }

  console.log("[waffo/webhook] parsed order", {
    deliveryId: event.id,
    tierId: parsed.tierId,
    providerRef: parsed.providerRef,
    userId: parsed.userId,
    userEmail: parsed.userEmail,
  });

  const tier = getPricingTier(parsed.tierId);
  if (!tier) {
    console.warn("[waffo/webhook] unknown tier", {
      deliveryId: event.id,
      tierId: parsed.tierId,
    });
    return {
      action: "unknown_tier",
      eventType: event.eventType,
      tierId: parsed.tierId,
      providerRef: parsed.providerRef,
    };
  }

  const result = parsed.userId
    ? await completeTierPurchase({
        userId: parsed.userId,
        tierId: parsed.tierId,
        provider: "waffo",
        providerRef: parsed.providerRef,
      })
    : await completeTierPurchaseByEmail({
        email: parsed.userEmail!,
        tierId: parsed.tierId,
        provider: "waffo",
        providerRef: parsed.providerRef,
      });

  const action = result.alreadyGranted ? "already_granted" : "granted";
  console.log("[waffo/webhook] credit result", {
    deliveryId: event.id,
    action,
    tierId: tier.id,
    tierName: tier.name,
    providerRef: parsed.providerRef,
    creditsGranted: result.creditsGranted,
    balanceAfter: result.balanceAfter,
    userId: parsed.userId,
    userEmail: parsed.userEmail,
  });

  return {
    action,
    eventType: event.eventType,
    tierId: tier.id,
    tierName: tier.name,
    providerRef: parsed.providerRef,
    userId: parsed.userId,
    userEmail: parsed.userEmail,
    creditsGranted: result.creditsGranted,
    balanceAfter: result.balanceAfter,
  };
}

async function processRefundSucceededEvent(
  event: WebhookEvent,
): Promise<WaffoWebhookProcessResult> {
  const data = event.data as WebhookEventData;
  const providerRef = data.orderId?.trim();
  const refundRef =
    data.paymentId?.trim() ||
    data.refundTicketMerchantExternalId?.trim() ||
    event.eventId?.trim() ||
    null;

  console.log("[waffo/webhook] parsed refund", {
    deliveryId: event.id,
    providerRef,
    refundRef,
    buyerEmail: data.buyerEmail,
    amount: data.amount,
    refundStatus: data.refundStatus,
  });

  if (!providerRef) {
    console.warn("[waffo/webhook] refund missing orderId", {
      deliveryId: event.id,
    });
    return { action: "ignored", eventType: event.eventType };
  }

  try {
    const result = await refundTierPurchaseByProviderRef({
      providerRef,
      refundRef,
    });
    const action = result.alreadyRefunded ? "already_refunded" : "refunded";
    console.log("[waffo/webhook] refund result", {
      deliveryId: event.id,
      action,
      providerRef,
      creditsRevoked: result.creditsRevoked,
      balanceAfter: result.balanceAfter,
      paymentId: result.paymentId,
    });
    return {
      action,
      eventType: event.eventType,
      providerRef,
      creditsRevoked: result.creditsRevoked,
      balanceAfter: result.balanceAfter,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/payment not found/i.test(message)) {
      console.warn("[waffo/webhook] refund payment missing", {
        deliveryId: event.id,
        providerRef,
        message,
      });
      return {
        action: "refund_payment_missing",
        eventType: event.eventType,
        providerRef,
      };
    }
    throw error;
  }
}

export async function processWaffoWebhookEvent(
  event: WebhookEvent,
): Promise<WaffoWebhookProcessResult> {
  console.log("[waffo/webhook] process start", {
    deliveryId: event.id,
    eventType: event.eventType,
  });

  const eventType = String(event.eventType ?? "");

  if (isOrderCompletedEvent(eventType)) {
    return processOrderCompletedEvent(event);
  }

  if (isRefundSucceededEvent(eventType)) {
    return processRefundSucceededEvent(event);
  }

  console.log("[waffo/webhook] ignored (unsupported event)", {
    deliveryId: event.id,
    eventType: event.eventType,
  });
  return { action: "ignored", eventType: event.eventType };
}
