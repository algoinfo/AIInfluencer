import { NextRequest, NextResponse } from "next/server";
import { getSessionPayload } from "@/lib/auth-service";
import { ensureHttpsProxyDispatcher } from "@/lib/https-proxy";
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

async function loadSessionWithRetry(token: string | undefined) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await getSessionPayload(token);
    } catch (error) {
      lastError = error;
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export async function GET(req: NextRequest) {
  ensureHttpsProxyDispatcher();
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const { payload, session, created } = await loadSessionWithRetry(token);
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
