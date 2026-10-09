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

/**
 * Resolve the Waffo product for the active API environment.
 * - prod → WAFFO_LIVE_PRODUCT_* → built-in live SKU (never use test SKUs)
 * - test → WAFFO_PRODUCT_* → built-in test SKU (never use live SKUs)
 */
export function getWaffoProductId(tierId: string): string | null {
  const keys = TIER_PRODUCT_ENV[tierId];
  const defaults = DEFAULT_WAFFO_PRODUCTS[tierId];
  if (!keys || !defaults) return null;
  if (getWaffoEnvironment() === "prod") {
    return readProductId(keys.live) || defaults.live;
  }
  return readProductId(keys.test) || defaults.test;
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

  const result = await getWaffoClient().checkout.authenticated.create({
    productId: input.productId,
    currency: "USD",
    buyerIdentity: input.userId,
    buyerEmail: input.email,
    successUrl: input.successUrl,
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
  metadata?: Record<string, string> | null;
}

async function queryWaffoOrderByExternalId(
  externalId: string,
): Promise<WaffoOrderLookup | null> {
  const result = await getWaffoClient().graphql.query<{
    orders?: WaffoOrderLookup[];
  }>({
    query: `query ($ref: String!) {
      orders(filter: { orderMerchantExternalId: { eq: $ref } }) {
        id
        status
        productId
        orderMerchantExternalId
        metadata
      }
    }`,
    variables: { ref: externalId },
  });

  return result.data?.orders?.[0] ?? null;
}

async function queryWaffoOrderById(
  orderId: string,
): Promise<WaffoOrderLookup | null> {
  const result = await getWaffoClient().graphql.query<{
    order?: WaffoOrderLookup | null;
  }>({
    query: `query ($id: String!) {
      order(id: $id) {
        id
        status
        productId
        orderMerchantExternalId
        metadata
      }
    }`,
    variables: { id: orderId },
  });

  return result.data?.order ?? null;
}

function isWaffoOrderPaid(status: string | undefined): boolean {
  const normalized = status?.trim().toLowerCase();
  return (
    normalized === "completed" ||
    normalized === "paid" ||
    normalized === "succeeded"
  );
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

  const metadata = order.metadata ?? {};
  const metadataUserId = metadata.userId?.trim();
  if (metadataUserId && metadataUserId !== input.expectedUserId) {
    throw new Error("This payment belongs to a different account.");
  }

  const tierId =
    metadata.tierId?.trim() ||
    (order.productId ? getTierIdForWaffoProduct(order.productId) : null);
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

export function parseWaffoOrderCompleted(
  event: WebhookEvent,
): {
  providerRef: string;
  tierId: string;
  userId: string | null;
  userEmail: string | null;
} | null {
  if (event.eventType !== WebhookEventType.OrderCompleted) return null;

  const data = event.data as WebhookEventData;
  const metadata = data.orderMetadata ?? {};
  const resolvedTierId =
    (typeof metadata.tierId === "string" && metadata.tierId) ||
    (typeof metadata.productId === "string"
      ? getTierIdForWaffoProduct(metadata.productId)
      : null);

  const userId =
    (typeof metadata.userId === "string" && metadata.userId) ||
    data.merchantProvidedBuyerIdentity?.trim() ||
    null;
  const userEmail = data.buyerEmail?.trim().toLowerCase() || null;
  const providerRef = data.orderId?.trim();

  if (!providerRef || !resolvedTierId) return null;
  if (!userId && !userEmail) return null;

  return {
    providerRef,
    tierId: resolvedTierId,
    userId,
    userEmail,
  };
}

export async function processWaffoWebhookEvent(
  event: WebhookEvent,
): Promise<void> {
  const parsed = parseWaffoOrderCompleted(event);
  if (!parsed) return;

  const tier = getPricingTier(parsed.tierId);
  if (!tier) {
    console.warn("[waffo/webhook] unknown tier", { tierId: parsed.tierId });
    return;
  }

  if (parsed.userId) {
    await completeTierPurchase({
      userId: parsed.userId,
      tierId: parsed.tierId,
      provider: "waffo",
      providerRef: parsed.providerRef,
    });
    return;
  }

  await completeTierPurchaseByEmail({
    email: parsed.userEmail!,
    tierId: parsed.tierId,
    provider: "waffo",
    providerRef: parsed.providerRef,
  });
}
