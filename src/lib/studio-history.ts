/** Client-side generation history (like tell's inline creations list). */

export type StudioHistoryStatus = "generating" | "done" | "failed";

export type StudioHistoryItem = {
  id: string;
  title: string;
  createdAt: string;
  /** Prefer durable R2 URL; empty while generating / failed. */
  videoUrl: string;
  durationSec: number;
  modelMark: string;
  status: StudioHistoryStatus;
  resolution?: string;
  errorMessage?: string;
  /** Wall-clock seconds for the finished or last-known run. */
  elapsedSec?: number;
};

const STORAGE_KEY = "genjutsu:studio-history";
const MAX_ITEMS = 24;

/** DB/proxy bookkeeping failed after the video was already rendered. */
export function isBookkeepingHistoryError(message?: string): boolean {
  if (!message) return false;
  return /disturbed or locked|interrupted|Could not load creations|Could not reach fal/i.test(
    message,
  );
}

function normalizeItem(
  raw: StudioHistoryItem,
  options?: { dropGenerating?: boolean },
): StudioHistoryItem | null {
  if (!raw || typeof raw !== "object" || !raw.id) return null;
  const status: StudioHistoryStatus =
    raw.status === "generating" ||
    raw.status === "failed" ||
    raw.status === "done"
      ? raw.status
      : raw.videoUrl
        ? "done"
        : "failed";

  // In-flight rows are memory-only — never persist / never revive as Failed.
  if (status === "generating") {
    if (options?.dropGenerating) return null;
    return {
      id: String(raw.id),
      title:
        typeof raw.title === "string" && raw.title.trim()
          ? raw.title
          : "Generation",
      createdAt:
        typeof raw.createdAt === "string"
          ? raw.createdAt
          : new Date().toISOString(),
      videoUrl: "",
      durationSec:
        typeof raw.durationSec === "number" && Number.isFinite(raw.durationSec)
          ? raw.durationSec
          : 0,
      modelMark:
        typeof raw.modelMark === "string" && raw.modelMark.trim()
          ? raw.modelMark
          : "—",
      status: "generating",
      resolution:
        typeof raw.resolution === "string" ? raw.resolution : undefined,
      elapsedSec:
        typeof raw.elapsedSec === "number" && Number.isFinite(raw.elapsedSec)
          ? raw.elapsedSec
          : undefined,
    };
  }

  const videoUrl =
    typeof raw.videoUrl === "string" && !raw.videoUrl.startsWith("blob:")
      ? raw.videoUrl
      : "";

  // Recover false "Interrupted" failures when a playable URL is present.
  const interrupted =
    status === "failed" &&
    typeof raw.errorMessage === "string" &&
    /interrupted/i.test(raw.errorMessage);
  const resolvedStatus: StudioHistoryStatus =
    videoUrl && (status === "done" || interrupted) ? "done" : status;

  if (resolvedStatus === "done" && !videoUrl) return null;

  return {
    id: String(raw.id),
    title:
      typeof raw.title === "string" && raw.title.trim()
        ? raw.title
        : "Generation",
    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : new Date().toISOString(),
    videoUrl,
    durationSec:
      typeof raw.durationSec === "number" && Number.isFinite(raw.durationSec)
        ? raw.durationSec
        : 0,
    modelMark:
      typeof raw.modelMark === "string" && raw.modelMark.trim()
        ? raw.modelMark
        : "—",
    status: resolvedStatus,
    resolution: typeof raw.resolution === "string" ? raw.resolution : undefined,
    errorMessage:
      resolvedStatus === "failed" ? raw.errorMessage || undefined : undefined,
    elapsedSec:
      typeof raw.elapsedSec === "number" && Number.isFinite(raw.elapsedSec)
        ? raw.elapsedSec
        : undefined,
  };
}

export function loadStudioHistory(): StudioHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StudioHistoryItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => normalizeItem(item, { dropGenerating: true }))
      .filter((item): item is StudioHistoryItem => item != null)
      .filter(
        (item) =>
          !(
            item.status === "failed" &&
            isBookkeepingHistoryError(item.errorMessage) &&
            !item.videoUrl
          ),
      )
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

export function saveStudioHistory(items: StudioHistoryItem[]) {
  if (typeof window === "undefined") return;
  const persistable = items
    .map((item) => normalizeItem(item, { dropGenerating: true }))
    .filter((item): item is StudioHistoryItem => item != null)
    .filter(
      (item) =>
        !(
          item.status === "failed" &&
          isBookkeepingHistoryError(item.errorMessage) &&
          !item.videoUrl
        ),
    )
    .slice(0, MAX_ITEMS);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  } catch {
    /* quota */
  }
}

export function prependStudioHistory(
  items: StudioHistoryItem[],
  next: StudioHistoryItem,
): StudioHistoryItem[] {
  const merged = [next, ...items.filter((item) => item.id !== next.id)].slice(
    0,
    MAX_ITEMS,
  );
  saveStudioHistory(merged);
  return merged;
}

export function updateStudioHistoryItem(
  items: StudioHistoryItem[],
  id: string,
  patch: Partial<StudioHistoryItem>,
): StudioHistoryItem[] {
  const merged = items.map((item) =>
    item.id === id ? { ...item, ...patch, id: item.id } : item,
  );
  saveStudioHistory(merged);
  return merged;
}

export function removeStudioHistoryItem(
  items: StudioHistoryItem[],
  id: string,
): StudioHistoryItem[] {
  const merged = items.filter((item) => item.id !== id);
  saveStudioHistory(merged);
  return merged;
}

/** Newest first — safe for ISO and legacy SQL datetime strings. */
export function sortStudioHistoryNewestFirst(
  items: StudioHistoryItem[],
): StudioHistoryItem[] {
  return [...items].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

export function historyStatusLabel(status: StudioHistoryStatus): string {
  switch (status) {
    case "generating":
      return "Generating";
    case "failed":
      return "Failed";
    default:
      return "Ready";
  }
}

export function formatHistoryWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Cloud creation row from GET /api/user/creations. */
export type CloudCreationItem = {
  id: string;
  title: string;
  createdAt: string;
  videoUrl: string;
  durationSec: number;
  modelMark: string;
  resolution?: string;
  status: StudioHistoryStatus;
  errorMessage?: string;
};

export function cloudCreationToHistoryItem(
  item: CloudCreationItem,
): StudioHistoryItem {
  return {
    id: item.id,
    title: item.title,
    createdAt: item.createdAt,
    videoUrl: item.videoUrl,
    durationSec: item.durationSec,
    modelMark: item.modelMark,
    resolution: item.resolution,
    status: item.status,
    errorMessage: item.errorMessage,
  };
}

/**
 * Merge cloud history with local rows.
 * Cloud wins on the same id; local-only done/failed/generating are kept.
 */
export function mergeCloudStudioHistory(
  local: StudioHistoryItem[],
  cloud: StudioHistoryItem[],
): StudioHistoryItem[] {
  const byId = new Map<string, StudioHistoryItem>();
  for (const item of local) {
    const normalized = normalizeItem(item);
    if (normalized) byId.set(normalized.id, normalized);
  }
  for (const item of cloud) {
    const normalized = normalizeItem(item);
    if (!normalized) continue;
    const existing = byId.get(normalized.id);
    // Prefer cloud, but don't let an empty/failed cloud row erase a local Ready.
    if (
      existing?.status === "done" &&
      existing.videoUrl &&
      (normalized.status !== "done" || !normalized.videoUrl)
    ) {
      continue;
    }
    // Cloud Ready always replaces a local Failed / generating placeholder.
    if (
      existing &&
      existing.status !== "done" &&
      normalized.status === "done" &&
      normalized.videoUrl
    ) {
      byId.set(normalized.id, {
        ...normalized,
        elapsedSec: existing.elapsedSec ?? normalized.elapsedSec,
      });
      continue;
    }
    byId.set(normalized.id, normalized);
  }
  const merged = sortStudioHistoryNewestFirst(Array.from(byId.values()));
  saveStudioHistory(merged);
  return merged.slice(0, MAX_ITEMS);
}

/** Delete a cloud creation; returns false if unauthorized / not found. */
export async function deleteCloudStudioHistory(id: string): Promise<boolean> {
  try {
    const res = await fetch(
      `/api/user/creations?id=${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchCloudStudioHistory(
  limit = 24,
): Promise<StudioHistoryItem[] | null> {
  try {
    const res = await fetch(`/api/user/creations?limit=${limit}`, {
      credentials: "include",
      cache: "no-store",
    });
    if (res.status === 401) return null;
    if (!res.ok) return null;
    const data = (await res.json()) as { items?: CloudCreationItem[] };
    if (!Array.isArray(data.items)) return [];
    return data.items.map(cloudCreationToHistoryItem);
  } catch {
    return null;
  }
}

/** Ensure a finished local generation is written to Turso. */
export async function persistCloudStudioHistory(input: {
  id: string;
  title: string;
  videoUrl?: string;
  r2Key?: string | null;
  durationSec: number;
  modelMark: string;
  resolution?: string;
  product: "motion-transfer" | "object-swap";
  status: "done" | "failed";
  errorMessage?: string;
}): Promise<StudioHistoryItem | null> {
  try {
    const res = await fetch("/api/user/creations", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { item?: CloudCreationItem };
    return data.item ? cloudCreationToHistoryItem(data.item) : null;
  } catch {
    return null;
  }
}
