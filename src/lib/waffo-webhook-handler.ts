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
    payloadBytes: payload.length,
    hasSignature: !!signature,
  });

  if (!signature) {
    return new NextResponse("Missing x-waffo-signature header", { status: 401 });
  }

  try {
    const event = verifyWaffoWebhook(payload, signature);
    void processWaffoWebhookEvent(event).catch((error) => {
      console.error("[waffo/webhook] processing failed", {
        route,
        deliveryId: event.id,
        message: error instanceof Error ? error.message : String(error),
      });
    });
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[waffo/webhook] verify failed", { route, message });
    return new NextResponse(message, { status: 400 });
  }
}
