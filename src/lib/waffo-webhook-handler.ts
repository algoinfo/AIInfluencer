import { NextRequest, NextResponse } from "next/server";
import { processWaffoWebhookEvent, verifyWaffoWebhook } from "@/lib/waffo";

export async function handleWaffoWebhookRequest(
  req: NextRequest,
  route: string,
): Promise<NextResponse> {
  const payload = await req.text();
  const signature = req.headers.get("x-waffo-signature");

  console.log("[waffo/webhook] incoming", {
    route,
    method: req.method,
    payloadBytes: payload.length,
    hasSignature: !!signature,
    contentType: req.headers.get("content-type"),
  });

  if (!signature) {
    console.warn("[waffo/webhook] missing signature", { route });
    return new NextResponse("Missing x-waffo-signature header", { status: 401 });
  }

  try {
    const event = verifyWaffoWebhook(payload, signature);
    console.log("[waffo/webhook] verified", {
      route,
      deliveryId: event.id,
      eventType: event.eventType,
      eventId: event.eventId,
      timestamp: event.timestamp,
      mode: event.mode,
      storeId: event.storeId,
    });

    try {
      const result = await processWaffoWebhookEvent(event);
      console.log("[waffo/webhook] processed", {
        route,
        deliveryId: event.id,
        eventType: event.eventType,
        ...result,
      });
    } catch (error) {
      console.error("[waffo/webhook] processing failed", {
        route,
        deliveryId: event.id,
        eventType: event.eventType,
        message: error instanceof Error ? error.message : String(error),
      });
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[waffo/webhook] verify failed", { route, message });
    return new NextResponse(message, { status: 400 });
  }
}
