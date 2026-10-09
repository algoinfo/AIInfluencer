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

function normalizeItem(raw: StudioHistoryItem): StudioHistoryItem | null {
  if (!raw || typeof raw !== "object" || !raw.id) return null;
  const status: StudioHistoryStatus =
    raw.status === "generating" || raw.status === "failed" || raw.status === "done"
      ? raw.status
      : raw.videoUrl
        ? "done"
        : "failed";
  // Orphaned in-flight rows after reload cannot resume.
  const resolvedStatus =
    status === "generating" ? ("failed" as const) : status;
  const videoUrl =
    typeof raw.videoUrl === "string" && !raw.videoUrl.startsWith("blob:")
      ? raw.videoUrl
      : "";
  if (resolvedStatus === "done" && !videoUrl) return null;
  return {
    id: String(raw.id),
    title: typeof raw.title === "string" && raw.title.trim() ? raw.title : "Generation",
    createdAt:
      typeof raw.createdAt === "string" ? raw.createdAt : new Date().toISOString(),
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
      resolvedStatus === "failed"
        ? raw.errorMessage ||
          (status === "generating" ? "Interrupted — try again." : undefined)
        : undefined,
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
      .map(normalizeItem)
      .filter((item): item is StudioHistoryItem => item != null)
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

export function saveStudioHistory(items: StudioHistoryItem[]) {
  if (typeof window === "undefined") return;
  const persistable = items
    .map(normalizeItem)
    .filter((item): item is StudioHistoryItem => item != null)
    // Don't persist in-flight rows — they become "failed" on reload anyway.
    .filter((item) => item.status !== "generating")
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
 * Merge cloud history with local optimistic rows.
 * Prefer cloud for shared ids; keep in-flight local generating rows.
 */
export function mergeCloudStudioHistory(
  local: StudioHistoryItem[],
  cloud: StudioHistoryItem[],
): StudioHistoryItem[] {
  const byId = new Map<string, StudioHistoryItem>();
  for (const item of cloud) byId.set(item.id, item);
  for (const item of local) {
    if (item.status === "generating" && !byId.has(item.id)) {
      byId.set(item.id, item);
    }
  }
  const merged = Array.from(byId.values()).sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
  saveStudioHistory(merged);
  return merged.slice(0, MAX_ITEMS);
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
