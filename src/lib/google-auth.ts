import { randomUUID } from "crypto";
import type { NextRequest } from "next/server";
import { SITE_URL } from "@/lib/seo";

export const GOOGLE_OAUTH_STATE_COOKIE = "google_oauth_state";
export const GOOGLE_OAUTH_RETURN_COOKIE = "google_oauth_return";
export const GOOGLE_OAUTH_COOKIE_MAX_AGE = 60 * 10;

export function getGoogleClientId(): string {
  const id = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!id) throw new Error("GOOGLE_CLIENT_ID is not configured.");
  return id;
}

export function getGoogleClientSecret(): string {
  const secret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!secret) throw new Error("GOOGLE_CLIENT_SECRET is not configured.");
  return secret;
}

export function isGoogleAuthConfigured(): boolean {
  return (
    !!process.env.GOOGLE_CLIENT_ID?.trim() &&
    !!process.env.GOOGLE_CLIENT_SECRET?.trim()
  );
}

export function createGoogleOAuthState(): string {
  return randomUUID();
}

export function resolveGoogleRedirectUri(_req?: NextRequest): string {
  const explicit = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (explicit) return explicit;

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api/auth/google/callback";
  }

  return `${SITE_URL}/api/auth/google/callback`;
}

export function buildGoogleAuthUrl(input: {
  redirectUri: string;
  state: string;
}): string {
  const params = new URLSearchParams({
    client_id: getGoogleClientId(),
    redirect_uri: input.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: input.state,
    access_type: "online",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export interface GoogleUserProfile {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export async function exchangeGoogleCode(input: {
  code: string;
  redirectUri: string;
}): Promise<GoogleUserProfile> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: input.code,
      client_id: getGoogleClientId(),
      client_secret: getGoogleClientSecret(),
      redirect_uri: input.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(
      tokenData.error_description ||
        tokenData.error ||
        "Google token exchange failed.",
    );
  }

  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const profile = (await userRes.json()) as GoogleUserProfile & {
    error?: { message?: string };
  };

  if (!userRes.ok || !profile.sub || !profile.email) {
    throw new Error(profile.error?.message || "Could not load Google profile.");
  }

  return profile;
}

export function sanitizeOAuthReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}
