import {
  causeMessage,
  getHttpsProxyUrl,
  proxyFetch,
} from "@/lib/https-proxy";

/** Outbound fetch for Google OAuth; honors HTTPS_PROXY / HTTP_PROXY when set. */
export async function googleFetch(
  input: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string | URLSearchParams;
  },
): Promise<Response> {
  const proxy = getHttpsProxyUrl();
  const body =
    init?.body instanceof URLSearchParams ? init.body.toString() : init?.body;

  try {
    return await proxyFetch(input, {
      method: init?.method,
      headers: init?.headers,
      body,
    });
  } catch (error) {
    const detail =
      causeMessage(error) ||
      (error instanceof Error ? error.message : String(error));
    const hint = proxy
      ? "Check HTTPS_PROXY."
      : "If you are behind a firewall, set HTTPS_PROXY (e.g. http://127.0.0.1:7890).";
    throw new Error(
      `Could not reach Google (${detail || "network error"}). ${hint}`,
    );
  }
}
