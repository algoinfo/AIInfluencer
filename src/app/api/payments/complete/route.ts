import { NextRequest, NextResponse } from "next/server";
import { getPricingTier } from "@/data/pricing";
import { getRequestSessionFromReq } from "@/lib/request-session";
import { completeTierPurchase } from "@/lib/user-credits";
import { resolveWaffoPurchase } from "@/lib/waffo";
import { handleWaffoWebhookRequest } from "@/lib/waffo-webhook-handler";

async function handlePurchaseComplete(req: NextRequest): Promise<NextResponse> {
  try {
    const { session } = await getRequestSessionFromReq(req);
    if (!session.user_id) {
      return NextResponse.json({ error: "Login required." }, { status: 401 });
    }

    const body = (await req.json()) as {
      sessionId?: string;
      orderId?: string | null;
      orderMerchantExternalId?: string | null;
    };

    if (!body.sessionId && !body.orderId && !body.orderMerchantExternalId) {
      return NextResponse.json(
        { error: "sessionId is required." },
        { status: 400 },
      );
    }

    const purchase = await resolveWaffoPurchase({
      orderId: body.orderId,
      orderMerchantExternalId: body.orderMerchantExternalId,
      expectedUserId: session.user_id,
    });

    const tier = getPricingTier(purchase.tierId);
    if (!tier) {
      return NextResponse.json({ error: "Unknown pricing tier." }, { status: 400 });
    }

    const result = await completeTierPurchase({
      userId: session.user_id,
      tierId: purchase.tierId,
      provider: "waffo",
      providerRef: purchase.providerRef,
    });

    return NextResponse.json({
      ok: true,
      tierId: purchase.tierId,
      tierName: tier.name,
      creditsGranted: result.creditsGranted,
      balanceAfter: result.balanceAfter,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not complete purchase.";
    const status =
      message.includes("not completed") ||
      message.includes("different account") ||
      message.includes("not found yet")
        ? 400
        : 500;
    console.error("[payments/complete] failed", { message });
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  if (req.headers.get("x-waffo-signature")) {
    return handleWaffoWebhookRequest(req, "/api/payments/complete");
  }
  return handlePurchaseComplete(req);
}
