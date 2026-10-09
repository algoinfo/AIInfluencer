import { ProxyAgent, fetch as undiciFetch, setGlobalDispatcher } from "undici";

let installed = false;
let cachedAgent: ProxyAgent | null = null;

export function getHttpsProxyUrl(): string | null {
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

function getProxyAgent(): ProxyAgent | null {
  const proxy = getHttpsProxyUrl();
  if (!proxy) return null;
  if (!cachedAgent) cachedAgent = new ProxyAgent(proxy);
  return cachedAgent;
}

/** Install undici global dispatcher once (helps native fetch when it shares undici). */
export function ensureHttpsProxyDispatcher(): void {
  if (installed) return;
  installed = true;
  const agent = getProxyAgent();
  if (!agent) return;
  setGlobalDispatcher(agent);
  console.log(
    `[https-proxy] using ${getHttpsProxyUrl()} for outbound requests`,
  );
}

export function causeMessage(error: unknown): string {
  if (!error || typeof error !== "object") return "";
  const cause = (error as { cause?: unknown }).cause;
  if (cause instanceof Error) return cause.message;
  if (cause && typeof cause === "object" && "message" in cause) {
    return String((cause as { message: unknown }).message);
  }
  return "";
}

type FetchInput = Parameters<typeof fetch>[0];
type FetchInit = Parameters<typeof fetch>[1];

/** fetch that honors HTTPS_PROXY / HTTP_PROXY when set. */
export function proxyFetch(
  input: FetchInput,
  init?: FetchInit,
): Promise<Response> {
  ensureHttpsProxyDispatcher();
  const agent = getProxyAgent();
  if (!agent) {
    return fetch(input, init);
  }

  return undiciFetch(input as string | URL, {
    ...(init as object),
    dispatcher: agent,
  }) as unknown as Promise<Response>;
}
