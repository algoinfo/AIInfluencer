/** Isomorphic helpers for durable history URLs (R2 public or same-origin proxy). */

export function isEphemeralProviderUrl(url: string): boolean {
  if (!url) return false;
  return /fal\.(media|ai)|v3b\.fal\.media|higgsfield\.ai|openai\.com\/files/i.test(
    url,
  );
}

export function mediaProxyPathForR2Key(key: string): string {
  const clean = key.replace(/^\/+/, "").trim();
  return `/api/media/r2/${clean
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/")}`;
}

/**
 * Prefer public R2 CDN, else same-origin proxy path from key.
 * Never return fal/provider CDN for history when a key exists.
 */
export function preferHistoryVideoUrl(input: {
  r2Url?: string | null;
  r2Key?: string | null;
  fallbackUrl?: string | null;
}): string {
  const publicOrGiven = input.r2Url?.trim();
  if (publicOrGiven && !isEphemeralProviderUrl(publicOrGiven)) {
    return publicOrGiven;
  }
  const key = input.r2Key?.trim();
  if (key) return mediaProxyPathForR2Key(key);

  const fallback = input.fallbackUrl?.trim() || "";
  if (fallback && !isEphemeralProviderUrl(fallback)) return fallback;
  // Last resort only — caller should avoid relying on fal for history.
  return fallback;
}
