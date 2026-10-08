import { NextRequest, NextResponse } from "next/server";
import { getPricingTier } from "@/data/pricing";
import { getRequestSessionFromReq } from "@/lib/request-session";

export async function POST(req: NextRequest) {
  try {
    const { payload } = await getRequestSessionFromReq(req);
    if (!payload.user?.email) {
      return NextResponse.json({ error: "Login required." }, { status: 401 });
    }

    const body = (await req.json()) as { tierId?: string };
    const tierId = body.tierId;
    if (!tierId || !getPricingTier(tierId)) {
      return NextResponse.json({ error: "Invalid pack." }, { status: 400 });
    }

    // Payment provider (Waffo/Creem) wiring comes next — same gate as tell.
    return NextResponse.json(
      {
        error:
          "Checkout is not configured yet. Packs are ready — payment keys will unlock buy.",
      },
      { status: 503 },
    );
  } catch (error) {
    console.error("[payments/checkout]", error);
    return NextResponse.json(
      { error: "Could not start checkout." },
      { status: 500 },
    );
  }
}
