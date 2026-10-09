export const CREDITS_UPDATED_EVENT = "genjutsu:credits-updated";

export type CreditsUpdatedDetail = {
  credits: number;
  email?: string;
};

let cachedCredits: { email?: string; credits: number } | null = null;

export function getCachedCredits(email?: string): number | null {
  if (!cachedCredits) return null;
  if (email && cachedCredits.email && cachedCredits.email !== email) return null;
  return cachedCredits.credits;
}

export function publishCreditsUpdated(
  credits: number,
  email?: string,
): void {
  cachedCredits = { credits, email };
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<CreditsUpdatedDetail>(CREDITS_UPDATED_EVENT, {
      detail: { credits, email },
    }),
  );
}

export async function fetchUserCredits(): Promise<number> {
  const res = await fetch("/api/user/credits", { credentials: "include" });
  if (!res.ok) throw new Error("Could not load credits.");
  const data = (await res.json()) as { credits: number };
  return data.credits;
}

/** Poll until credits rise above baseline, or attempts run out. */
export async function waitForCreditsIncrease(
  baseline: number,
  options?: { attempts?: number; intervalMs?: number },
): Promise<number | null> {
  const attempts = options?.attempts ?? 10;
  const intervalMs = options?.intervalMs ?? 1500;

  for (let i = 0; i < attempts; i += 1) {
    try {
      const credits = await fetchUserCredits();
      if (credits > baseline) return credits;
    } catch {
      /* keep polling */
    }
    if (i < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }
  return null;
}
