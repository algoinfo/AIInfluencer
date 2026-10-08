import { NextRequest, NextResponse } from "next/server";
import {
  GOOGLE_OAUTH_COOKIE_MAX_AGE,
  GOOGLE_OAUTH_RETURN_COOKIE,
  GOOGLE_OAUTH_STATE_COOKIE,
  buildGoogleAuthUrl,
  createGoogleOAuthState,
  isGoogleAuthConfigured,
  resolveGoogleRedirectUri,
  sanitizeOAuthReturnPath,
} from "@/lib/google-auth";

export async function GET(req: NextRequest) {
  if (!isGoogleAuthConfigured()) {
    return NextResponse.redirect(
      new URL("/?auth_error=Google%20sign-in%20is%20not%20configured", req.url),
    );
  }

  const redirectUri = resolveGoogleRedirectUri(req);
  const state = createGoogleOAuthState();
  const returnTo = sanitizeOAuthReturnPath(
    req.nextUrl.searchParams.get("returnTo"),
  );
  const authUrl = buildGoogleAuthUrl({ redirectUri, state });

  const res = NextResponse.redirect(authUrl);
  const secure = process.env.NODE_ENV === "production";

  res.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: GOOGLE_OAUTH_COOKIE_MAX_AGE,
    path: "/",
  });
  res.cookies.set(GOOGLE_OAUTH_RETURN_COOKIE, returnTo, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: GOOGLE_OAUTH_COOKIE_MAX_AGE,
    path: "/",
  });

  return res;
}
