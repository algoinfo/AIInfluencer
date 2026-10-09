import { NextRequest, NextResponse } from "next/server";
import { handleWaffoWebhookRequest } from "@/lib/waffo-webhook-handler";

/** Test webhook endpoint (e.g. ngrok → /api/paid/callback). */
export async function POST(req: NextRequest) {
  console.log("[paid/callback] POST hit", {
    hasSignature: !!req.headers.get("x-waffo-signature"),
    contentType: req.headers.get("content-type"),
  });
  const res = await handleWaffoWebhookRequest(req, "/api/paid/callback");
  console.log("[paid/callback] POST done", { status: res.status });
  return res;
}

/** Health check for ngrok / dashboard URL probes. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/paid/callback",
    environment: process.env.WAFFO_ENVIRONMENT?.trim() || "test",
  });
}
