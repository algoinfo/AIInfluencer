import { NextRequest, NextResponse } from "next/server";
import { logoutSession } from "@/lib/auth-service";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/session-cookie";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const payload = await logoutSession(token);

    const res = NextResponse.json(payload);
    if (token) {
      res.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/",
      });
    }
    return res;
  } catch (error) {
    console.error("[auth/logout]", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
