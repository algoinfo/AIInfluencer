import type { NextRequest } from "next/server";
import { SITE_URL } from "@/lib/seo";

/** Prefer the incoming request host so local checkout returns to localhost. */
export function getRequestOrigin(req: NextRequest): string {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    const proto = forwardedProto?.split(",")[0]?.trim() || "https";
    return `${proto}://${forwardedHost.split(",")[0]?.trim()}`;
  }

  const host = req.headers.get("host");
  if (host) {
    const proto =
      req.nextUrl.protocol.replace(":", "") ||
      (host.startsWith("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https");
    return `${proto}://${host}`;
  }

  return req.nextUrl.origin || SITE_URL;
}
