import { NextRequest, NextResponse } from "next/server";
import { getPricingTier } from "@/data/pricing";
import { getRequestOrigin } from "@/lib/request-origin";
import { getRequestSessionFromReq } from "@/lib/request-session";
import {
  createWaffoCheckout,
  getWaffoEnvironment,
  isWaffoConfigured,
  resolveWaffoProduct,
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

    const resolved = resolveWaffoProduct(tierId);
    if (!resolved) {
      console.error("[payments/checkout] missing product id", {
        tierId,
        environment: getWaffoEnvironment(),
      });
      return NextResponse.json(
        { error: "Checkout is not available for this pack yet." },
        { status: 400 },
      );
    }

    const origin = getRequestOrigin(req);
    const successUrl = `${origin}/account?purchase=success`;

    console.log("[waffo/checkout] creating session", {
      tierId,
      productId: resolved.productId,
      environment: resolved.environment,
      source: resolved.source,
      email,
      userId: session.user_id,
      origin,
    });

    try {
      const checkout = await createWaffoCheckout({
        tierId,
        productId: resolved.productId,
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
      console.error("[payments/checkout] failed", {
        message,
        environment: resolved.environment,
        productId: resolved.productId,
        source: resolved.source,
      });
      const envMismatch = /not found or not active for this environment/i.test(
        message,
      );
      return NextResponse.json(
        {
          error: envMismatch
            ? `Waffo rejected ${resolved.productId} for ${resolved.environment} (${resolved.source}). In the Waffo dashboard, open that product and Publish / Activate it for ${resolved.environment}.`
            : error instanceof Error
              ? error.message
              : "Could not start checkout.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("[payments/checkout] failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not start checkout.",
      },
      { status: 500 },
    );
  }
}
