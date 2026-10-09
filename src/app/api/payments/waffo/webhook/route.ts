import { NextRequest } from "next/server";
import { handleWaffoWebhookRequest } from "@/lib/waffo-webhook-handler";

export async function POST(req: NextRequest) {
  return handleWaffoWebhookRequest(req, "/api/payments/waffo/webhook");
}
