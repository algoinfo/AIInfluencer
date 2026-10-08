import { NextRequest, NextResponse } from "next/server";
import { getSessionPayload } from "@/lib/auth-service";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/session-cookie";

function attachSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  return res;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const { payload, session, created } = await getSessionPayload(token);
    const res = NextResponse.json(payload);
    if (created) attachSessionCookie(res, session.token);
    return res;
  } catch (error) {
    console.error("[auth/session]", error);
    return NextResponse.json(
      { error: "Failed to load session" },
      { status: 500 },
    );
  }
}
