"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import type { AuthMode } from "@/components/auth/AuthForm";

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openAuthModal, isLoggedIn, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (isLoggedIn) {
      router.replace("/");
      return;
    }
    const mode =
      searchParams.get("mode") === "register" ? "register" : "login";
    openAuthModal({ mode: mode as AuthMode });
    router.replace("/");
  }, [ready, isLoggedIn, searchParams, openAuthModal, router]);

  return null;
}

export function LoginRedirectClient() {
  return (
    <Suspense fallback={null}>
      <LoginRedirect />
    </Suspense>
  );
}
