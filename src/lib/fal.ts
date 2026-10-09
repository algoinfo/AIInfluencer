import { fal } from "@fal-ai/client";
import {
  ensureHttpsProxyDispatcher,
  proxyFetch,
} from "@/lib/https-proxy";

export function getFalKeyFromEnv(): string | null {
  const key = process.env.FAL_KEY?.trim();
  return key || null;
}

export function configureFal(key: string) {
  ensureHttpsProxyDispatcher();
  fal.config({
    credentials: key,
    // Local networks that block fal need HTTPS_PROXY (Clash etc.).
    fetch: proxyFetch as typeof fetch,
  });
}

export { fal };
