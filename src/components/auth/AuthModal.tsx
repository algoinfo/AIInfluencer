"use client";

import { useEffect, useState } from "react";
import { AuthForm, type AuthMode, type AuthReason } from "./AuthForm";

interface AuthModalProps {
  open: boolean;
  mode: AuthMode;
  reason?: AuthReason;
  initialError?: string | null;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
  onBeforeOAuth?: () => void | Promise<void>;
}

export function AuthModal({
  open,
  mode,
  reason,
  initialError,
  onModeChange,
  onClose,
  onLogin,
  onRegister,
  onBeforeOAuth,
}: AuthModalProps) {
  const googleAuthHref =
    typeof window !== "undefined"
      ? `/api/auth/google?returnTo=${encodeURIComponent(`${window.location.pathname}${window.location.search}`)}`
      : "/api/auth/google";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setError(initialError ?? null);
  }, [open, mode, initialError]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[400px] rounded-2xl border border-white/[0.1] bg-[#111114] px-6 py-7 shadow-[0_40px_100px_rgba(0,0,0,0.65)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-lg leading-none text-fg-subtle transition hover:text-fg"
        >
          ×
        </button>

        <div id="auth-modal-title" className="pr-6">
          <AuthForm
            mode={mode}
            reason={reason}
            googleAuthHref={googleAuthHref}
            onGoogleAuthClick={onBeforeOAuth}
            onModeChange={onModeChange}
            onSubmit={async (email, password, submitMode) => {
              setError(null);
              try {
                if (submitMode === "register") {
                  await onRegister(email, password);
                } else {
                  await onLogin(email, password);
                }
                onClose();
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Something went wrong",
                );
              }
            }}
          />
          {error ? (
            <p
              className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
              role="alert"
            >
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
