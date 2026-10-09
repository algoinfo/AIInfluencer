import { ProxyAgent, fetch as undiciFetch } from "undici";

function getProxyUrl(): string | null {
  const raw =
    process.env.HTTPS_PROXY?.trim() ||
    process.env.https_proxy?.trim() ||
    process.env.HTTP_PROXY?.trim() ||
    process.env.http_proxy?.trim() ||
    process.env.ALL_PROXY?.trim() ||
    process.env.all_proxy?.trim() ||
    "";
  return raw || null;
}

function causeMessage(error: unknown): string {
  if (!error || typeof error !== "object") return "";
  const cause = (error as { cause?: unknown }).cause;
  if (cause instanceof Error) return cause.message;
  if (cause && typeof cause === "object" && "message" in cause) {
    return String((cause as { message: unknown }).message);
  }
  return "";
}

/** Outbound fetch for Google OAuth; honors HTTPS_PROXY / HTTP_PROXY when set. */
export async function googleFetch(
  input: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string | URLSearchParams;
  },
): Promise<Response> {
  const proxy = getProxyUrl();
  const body =
    init?.body instanceof URLSearchParams ? init.body.toString() : init?.body;

  try {
    if (proxy) {
      const res = await undiciFetch(input, {
        method: init?.method,
        headers: init?.headers,
        body,
        dispatcher: new ProxyAgent(proxy),
      });
      return res as unknown as Response;
    }

    return await fetch(input, {
      method: init?.method,
      headers: init?.headers,
      body,
    });
  } catch (error) {
    const detail = causeMessage(error) || (error instanceof Error ? error.message : String(error));
    const hint = proxy
      ? "Check HTTPS_PROXY."
      : "If you are behind a firewall, set HTTPS_PROXY (e.g. http://127.0.0.1:7890).";
    throw new Error(
      `Could not reach Google (${detail || "network error"}). ${hint}`,
    );
  }
}
