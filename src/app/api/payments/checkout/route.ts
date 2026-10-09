import { NextRequest, NextResponse } from "next/server";
import { getPricingTier } from "@/data/pricing";
import { getRequestOrigin } from "@/lib/request-origin";
import { getRequestSessionFromReq } from "@/lib/request-session";
import {
  createWaffoCheckout,
  getWaffoEnvironment,
  getWaffoProductId,
  isWaffoConfigured,
} from "@/lib/waffo";

export async function POST(req: NextRequest) {
  try {
    const { payload, session } = await getRequestSessionFromReq(req);
    const email = payload.user?.email?.trim().toLowerCase();
    if (!email || !session.user_id) {
      return NextResponse.json({ error: "Login required." }, { status: 401 });
    }

    const body = (await req.json()) as { tierId?: string };
    const tierId = body.tierId?.trim();
    if (!tierId || !getPricingTier(tierId)) {
      return NextResponse.json({ error: "Invalid pack." }, { status: 400 });
    }

    if (!isWaffoConfigured()) {
      console.error("[payments/checkout] waffo not configured", {
        tierId,
        environment: getWaffoEnvironment(),
      });
      return NextResponse.json(
        { error: "Checkout is not configured yet." },
        { status: 503 },
      );
    }

    const environment = getWaffoEnvironment();
    const productId = getWaffoProductId(tierId);
    if (!productId) {
      console.error("[payments/checkout] missing product id for environment", {
        tierId,
        environment,
        hint:
          environment === "prod"
            ? "Set WAFFO_LIVE_PRODUCT_BASIC / WAFFO_LIVE_PRODUCT_PRO"
            : "Set WAFFO_PRODUCT_BASIC / WAFFO_PRODUCT_PRO",
      });
      return NextResponse.json(
        {
          error:
            environment === "prod"
              ? "Checkout is not configured for production. Set WAFFO_LIVE_PRODUCT_* on the server."
              : "Checkout is not available for this pack yet.",
        },
        { status: 400 },
      );
    }

    const origin = getRequestOrigin(req);
    const successUrl = `${origin}/account?purchase=success`;

    console.log("[waffo/checkout] creating session", {
      tierId,
      productId,
      environment,
      email,
      userId: session.user_id,
      origin,
    });

    const checkout = await createWaffoCheckout({
      tierId,
      productId,
      userId: session.user_id,
      email,
      successUrl,
    });

    return NextResponse.json({
      provider: "waffo",
      sessionId: checkout.sessionId,
      checkoutUrl: checkout.checkoutUrl,
      orderMerchantExternalId: checkout.orderMerchantExternalId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const environment = getWaffoEnvironment();
    console.error("[payments/checkout] failed", { message, environment });
    const envMismatch = /not found or not active for this environment/i.test(
      message,
    );
    return NextResponse.json(
      {
        error: envMismatch
          ? `Waffo product does not match WAFFO_ENVIRONMENT=${environment}. Use live product IDs with prod, test IDs with test.`
          : error instanceof Error
            ? error.message
            : "Could not start checkout.",
      },
      { status: 500 },
    );
  }
}
