import { NextRequest, NextResponse } from "next/server";
import { signInWithGoogle } from "@/lib/auth-service";
import {
  GOOGLE_OAUTH_RETURN_COOKIE,
  GOOGLE_OAUTH_STATE_COOKIE,
  exchangeGoogleCode,
  resolveGoogleRedirectUri,
  sanitizeOAuthReturnPath,
} from "@/lib/google-auth";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/session-cookie";

function redirectWithAuthError(req: NextRequest, message: string) {
  const url = new URL("/", req.url);
  url.searchParams.set("auth_error", message);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const error = req.nextUrl.searchParams.get("error");
  if (error) {
    return redirectWithAuthError(req, "Google sign-in was cancelled.");
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const savedState = req.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return redirectWithAuthError(
      req,
      "Google sign-in failed. Please try again.",
    );
  }

  const returnTo = sanitizeOAuthReturnPath(
    req.cookies.get(GOOGLE_OAUTH_RETURN_COOKIE)?.value,
  );
  const redirectUri = resolveGoogleRedirectUri(req);

  try {
    const profile = await exchangeGoogleCode({ code, redirectUri });
    const sessionToken = req.cookies.get(SESSION_COOKIE)?.value;
    const { session } = await signInWithGoogle(sessionToken, {
      googleId: profile.sub,
      email: profile.email,
      emailVerified: profile.email_verified !== false,
    });

    const destination = new URL(returnTo, req.url);
    destination.searchParams.delete("auth_error");
    const res = NextResponse.redirect(destination);

    res.cookies.set(SESSION_COOKIE, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });
    res.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);
    res.cookies.delete(GOOGLE_OAUTH_RETURN_COOKIE);
    res.headers.set("Cache-Control", "no-store");

    return res;
  } catch (err) {
    console.error("[auth/google/callback]", err);
    const message =
      err instanceof Error ? err.message : "Google sign-in failed.";
    return redirectWithAuthError(req, message);
  }
}
