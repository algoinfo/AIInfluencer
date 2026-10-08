import { NextRequest, NextResponse } from "next/server";
import { recordUsage, type UsageAction } from "@/lib/auth-service";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/session-cookie";

export async function POST(req: NextRequest) {
  try {
    const { action } = (await req.json()) as { action?: UsageAction };
    if (action !== "generation" && action !== "download") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const result = await recordUsage(token, action);

    if (result.needsLogin) {
      return NextResponse.json(
        { needsLogin: true, ...result.payload },
        { status: 403 },
      );
    }

    const res = NextResponse.json(result.payload);
    if (result.created) {
      res.cookies.set(SESSION_COOKIE, result.session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/",
      });
    }
    return res;
  } catch (error) {
    console.error("[usage/record]", error);
    return NextResponse.json(
      { error: "Failed to record usage" },
      { status: 500 },
    );
  }
}
