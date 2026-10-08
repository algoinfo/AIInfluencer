/** Client-side generation history (like tell's inline creations list). */

export type StudioHistoryItem = {
  id: string;
  title: string;
  createdAt: string;
  /** Public R2 URL when available; otherwise a session blob URL. */
  videoUrl: string;
  durationSec: number;
  modelMark: string;
};

const STORAGE_KEY = "genjutsu:studio-history";
const MAX_ITEMS = 24;

export function loadStudioHistory(): StudioHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StudioHistoryItem[];
    if (!Array.isArray(parsed)) return [];
    // Drop ephemeral blob URLs after reload — they are invalid.
    return parsed.filter((item) => item.videoUrl && !item.videoUrl.startsWith("blob:"));
  } catch {
    return [];
  }
}

export function saveStudioHistory(items: StudioHistoryItem[]) {
  if (typeof window === "undefined") return;
  const persistable = items
    .filter((item) => item.videoUrl && !item.videoUrl.startsWith("blob:"))
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

export function formatHistoryWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
