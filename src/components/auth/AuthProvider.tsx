"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  requiresLoginForDownload,
  requiresLoginForGeneration,
  type AuthUser,
  type SessionPayload,
  type UsageCounts,
} from "@/lib/auth-limits";
import { readCachedAuthUser, writeCachedAuthUser } from "@/lib/auth-cache";
import { AuthModal } from "@/components/auth/AuthModal";
import type { AuthMode, AuthReason } from "@/components/auth/AuthForm";

const EMPTY_USAGE: UsageCounts = { generations: 0, downloads: 0 };

function resolveInitialUser(initialSession?: SessionPayload): AuthUser | null {
  return initialSession?.user ?? null;
}

function resolveInitialUsage(initialSession?: SessionPayload): UsageCounts {
  return initialSession?.usage ?? EMPTY_USAGE;
}

interface OpenAuthModalOptions {
  mode?: AuthMode;
  reason?: AuthReason;
  beforeOAuth?: () => void | Promise<void>;
}

interface AuthContextValue {
  ready: boolean;
  user: AuthUser | null;
  usage: UsageCounts;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  recordGeneration: () => Promise<boolean>;
  recordDownload: () => Promise<boolean>;
  needsLoginToGenerate: () => boolean;
  needsLoginToDownload: () => boolean;
  openAuthModal: (options?: OpenAuthModalOptions) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchSession(): Promise<SessionPayload> {
  const res = await fetch("/api/auth/session", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load session");
  return (await res.json()) as SessionPayload;
}

export function AuthProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession?: SessionPayload;
}) {
  const [ready, setReady] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(() =>
    resolveInitialUser(initialSession),
  );
  const [usage, setUsage] = useState<UsageCounts>(() =>
    resolveInitialUsage(initialSession),
  );
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>("login");
  const [authModalReason, setAuthModalReason] = useState<AuthReason>("nav");
  const [authModalError, setAuthModalError] = useState<string | null>(null);
  const beforeOAuthRef = useRef<(() => void | Promise<void>) | null>(null);

  const applyPayload = useCallback((payload: SessionPayload) => {
    setUser(payload.user);
    setUsage(payload.usage);
    writeCachedAuthUser(payload.user);
  }, []);

  useLayoutEffect(() => {
    if (initialSession?.user) {
      writeCachedAuthUser(initialSession.user);
      return;
    }
    const cached = readCachedAuthUser();
    if (cached) setUser((current) => current ?? cached);
  }, [initialSession?.user]);

  const refreshSession = useCallback(async () => {
    const payload = await fetchSession();
    applyPayload(payload);
  }, [applyPayload]);

  useEffect(() => {
    refreshSession()
      .catch((error) => console.error("[auth] session load failed", error))
      .finally(() => setReady(true));
  }, [refreshSession]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("auth_error");
    if (!authError) return;

    setAuthModalMode("login");
    setAuthModalReason("nav");
    setAuthModalError(authError);
    setAuthModalOpen(true);

    params.delete("auth_error");
    const next = params.toString();
    const path = next
      ? `${window.location.pathname}?${next}`
      : window.location.pathname;
    window.history.replaceState({}, "", path);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Login failed");
      }
      applyPayload((await res.json()) as SessionPayload);
    },
    [applyPayload],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Sign up failed");
      }
      applyPayload((await res.json()) as SessionPayload);
    },
    [applyPayload],
  );

  const logout = useCallback(async () => {
    setUser(null);
    writeCachedAuthUser(null);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
      applyPayload((await res.json()) as SessionPayload);
    } catch (error) {
      console.error("[auth] logout failed", error);
      void refreshSession();
    }
  }, [applyPayload, refreshSession]);

  const openAuthModal = useCallback((options?: OpenAuthModalOptions) => {
    beforeOAuthRef.current = options?.beforeOAuth ?? null;
    setAuthModalMode(options?.mode ?? "login");
    setAuthModalReason(options?.reason ?? "nav");
    setAuthModalError(null);
    setAuthModalOpen(true);
  }, []);

  const runBeforeOAuth = useCallback(async () => {
    const hook = beforeOAuthRef.current;
    if (hook) await hook();
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const recordUsageAction = useCallback(
    async (action: "generation" | "download") => {
      const res = await fetch("/api/usage/record", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = (await res.json()) as SessionPayload & {
        needsLogin?: boolean;
      };
      applyPayload(data);
      return res.status === 403 && !!data.needsLogin;
    },
    [applyPayload],
  );

  const recordGeneration = useCallback(
    () => recordUsageAction("generation"),
    [recordUsageAction],
  );

  const recordDownload = useCallback(
    () => recordUsageAction("download"),
    [recordUsageAction],
  );

  const needsLoginToGenerate = useCallback(
    () => requiresLoginForGeneration(user, usage),
    [user, usage],
  );

  const needsLoginToDownload = useCallback(
    () => requiresLoginForDownload(user, usage),
    [user, usage],
  );

  const value = useMemo(
    () => ({
      ready,
      user,
      usage,
      isLoggedIn: !!user,
      login,
      register,
      logout,
      refreshSession,
      recordGeneration,
      recordDownload,
      needsLoginToGenerate,
      needsLoginToDownload,
      openAuthModal,
      closeAuthModal,
    }),
    [
      ready,
      user,
      usage,
      login,
      register,
      logout,
      refreshSession,
      recordGeneration,
      recordDownload,
      needsLoginToGenerate,
      needsLoginToDownload,
      openAuthModal,
      closeAuthModal,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal
        open={authModalOpen}
        mode={authModalMode}
        reason={authModalReason}
        initialError={authModalError}
        onModeChange={setAuthModalMode}
        onClose={closeAuthModal}
        onLogin={login}
        onRegister={register}
        onBeforeOAuth={runBeforeOAuth}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
