import { NextRequest, NextResponse } from "next/server";
import { getRequestSessionFromReq } from "@/lib/request-session";
import { getUserCreditBalanceByEmail } from "@/lib/user-credits";

export async function GET(req: NextRequest) {
  try {
    const { payload } = await getRequestSessionFromReq(req);
    if (!payload.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const balance = await getUserCreditBalanceByEmail(payload.user.email);
    return NextResponse.json({ credits: balance?.credits ?? 0 });
  } catch (error) {
    console.error("[user/credits]", error);
    return NextResponse.json(
      { error: "Failed to load credits" },
      { status: 500 },
    );
  }
}
