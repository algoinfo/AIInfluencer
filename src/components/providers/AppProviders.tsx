"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import type { SessionPayload } from "@/lib/auth-limits";

export function AppProviders({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession?: SessionPayload;
}) {
  return (
    <AuthProvider initialSession={initialSession}>{children}</AuthProvider>
  );
}
