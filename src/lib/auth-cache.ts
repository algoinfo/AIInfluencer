import type { AuthUser } from "@/lib/auth-limits";

const AUTH_USER_KEY = "genjutsu:auth-user";

export function readCachedAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { email?: unknown };
    if (typeof parsed.email === "string" && parsed.email.includes("@")) {
      return { email: parsed.email };
    }
  } catch {
    /* ignore corrupt cache */
  }
  return null;
}

export function writeCachedAuthUser(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(AUTH_USER_KEY);
    return;
  }
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ email: user.email }));
}
