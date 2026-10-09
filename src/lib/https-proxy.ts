import { ProxyAgent, fetch as undiciFetch, setGlobalDispatcher } from "undici";

let installed = false;
let cachedAgent: ProxyAgent | null = null;
let loggedProxy = false;

const PROXY_CONNECT_TIMEOUT_MS = 30_000;

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

function createProxyAgent(proxy: string): ProxyAgent {
  return new ProxyAgent({
    uri: proxy,
    connect: { timeout: PROXY_CONNECT_TIMEOUT_MS },
    requestTls: { timeout: PROXY_CONNECT_TIMEOUT_MS },
    proxyTls: { timeout: PROXY_CONNECT_TIMEOUT_MS },
  });
}

function getProxyAgent(): ProxyAgent | null {
  const proxy = getHttpsProxyUrl();
  if (!proxy) return null;
  if (!cachedAgent) cachedAgent = createProxyAgent(proxy);
  return cachedAgent;
}

/**
 * Swap in a fresh ProxyAgent after TLS/reset failures.
 * Keep the previous agent alive briefly so in-flight Turso/fal reads can finish.
 */
export function resetHttpsProxyAgent(): void {
  const prev = cachedAgent;
  const proxy = getHttpsProxyUrl();
  cachedAgent = proxy ? createProxyAgent(proxy) : null;
  if (cachedAgent) {
    setGlobalDispatcher(cachedAgent);
    installed = true;
  } else {
    installed = false;
  }
  if (prev) {
    setTimeout(() => {
      try {
        void prev.close();
      } catch {
        /* ignore */
      }
    }, 15_000);
  }
}

export function isTransientNetworkError(error: unknown): boolean {
  const detail = [
    error instanceof Error ? error.message : String(error ?? ""),
    causeMessage(error),
  ]
    .filter(Boolean)
    .join(" ");
  return /TLS|ECONNRESET|ECONNREFUSED|ETIMEDOUT|UND_ERR_CONNECT|socket disconnected|fetch failed|network|timeout|disturbed or locked/i.test(
    detail,
  );
}

/** Install undici global dispatcher once (helps native fetch when it shares undici). */
export function ensureHttpsProxyDispatcher(): void {
  const agent = getProxyAgent();
  if (!agent) return;
  if (!installed) {
    setGlobalDispatcher(agent);
    installed = true;
  }
  if (!loggedProxy) {
    loggedProxy = true;
    console.log(
      `[https-proxy] using ${getHttpsProxyUrl()} for outbound requests`,
    );
  }
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

type RequestLike = {
  url: string;
  method?: string;
  headers?: HeadersInit;
  redirect?: RequestRedirect;
  signal?: AbortSignal | null;
  arrayBuffer?: () => Promise<ArrayBuffer>;
};

/** Next/undici may use different Request classes — don't rely on instanceof. */
function asRequestLike(input: unknown): RequestLike | null {
  if (!input || typeof input !== "object") return null;
  const url = (input as { url?: unknown }).url;
  if (typeof url !== "string" || !url) return null;
  return input as RequestLike;
}

async function bufferBody(init?: FetchInit): Promise<ArrayBuffer | null> {
  const body = init?.body;
  if (body == null) return null;
  if (body instanceof ArrayBuffer) return body;
  if (ArrayBuffer.isView(body)) {
    return body.buffer.slice(
      body.byteOffset,
      body.byteOffset + body.byteLength,
    ) as ArrayBuffer;
  }
  if (typeof body === "string") {
    return new TextEncoder().encode(body).buffer as ArrayBuffer;
  }
  if (body instanceof Blob) {
    return body.arrayBuffer();
  }
  // ReadableStream / FormData / URLSearchParams — last resort via Response
  return new Response(body as BodyInit).arrayBuffer();
}

type Prepared = {
  url: string;
  method: string;
  headers: Headers;
  redirect?: RequestRedirect;
  signal?: AbortSignal;
  body: ArrayBuffer | null;
};

async function prepareProxyRequest(
  input: FetchInput,
  init?: FetchInit,
): Promise<Prepared> {
  const requestLike = asRequestLike(input);
  if (requestLike) {
    const headers = new Headers(requestLike.headers);
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => {
        headers.set(key, value);
      });
    }
    const method = (init?.method ?? requestLike.method ?? "GET").toUpperCase();
    let body: ArrayBuffer | null = null;
    if (method !== "GET" && method !== "HEAD") {
      if (init?.body != null) {
        body = await bufferBody(init);
      } else if (typeof requestLike.arrayBuffer === "function") {
        // Buffer via arrayBuffer — never forward request.body (locks the stream).
        const buf = await requestLike.arrayBuffer();
        body = buf.byteLength > 0 ? buf : null;
      }
    }
    return {
      url: requestLike.url,
      method,
      headers,
      redirect: init?.redirect ?? requestLike.redirect,
      signal: (init?.signal ?? requestLike.signal ?? undefined) || undefined,
      body,
    };
  }

  if (typeof input === "string" || input instanceof URL) {
    const method = (init?.method ?? "GET").toUpperCase();
    const body =
      method !== "GET" && method !== "HEAD" ? await bufferBody(init) : null;
    return {
      url: String(input),
      method,
      headers: new Headers(init?.headers),
      redirect: init?.redirect,
      signal: init?.signal || undefined,
      body,
    };
  }

  throw new Error("Unsupported fetch input for proxyFetch.");
}

function proxyFetchPrepared(
  prepared: Prepared,
  agent: ProxyAgent,
): Promise<Response> {
  const opts: Record<string, unknown> = {
    method: prepared.method,
    headers: prepared.headers,
    redirect: prepared.redirect,
    signal: prepared.signal,
    dispatcher: agent,
  };
  if (prepared.body != null && prepared.method !== "GET" && prepared.method !== "HEAD") {
    opts.body = prepared.body;
    opts.duplex = "half";
  }
  return undiciFetch(prepared.url, opts as never) as unknown as Promise<Response>;
}

/** fetch that honors HTTPS_PROXY / HTTP_PROXY when set. Retries once on TLS/reset. */
export async function proxyFetch(
  input: FetchInput,
  init?: FetchInit,
): Promise<Response> {
  ensureHttpsProxyDispatcher();
  const agent = getProxyAgent();
  if (!agent) {
    return fetch(input, init);
  }

  const prepared = await prepareProxyRequest(input, init);

  try {
    return await proxyFetchPrepared(prepared, agent);
  } catch (error) {
    if (!getHttpsProxyUrl() || !isTransientNetworkError(error)) throw error;
    resetHttpsProxyAgent();
    const next = getProxyAgent();
    if (!next) throw error;
    return proxyFetchPrepared(prepared, next);
  }
}
