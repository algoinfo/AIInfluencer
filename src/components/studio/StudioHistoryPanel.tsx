"use client";

import {
  formatHistoryWhen,
  historyStatusLabel,
  sortStudioHistoryNewestFirst,
  type StudioHistoryItem,
} from "@/lib/studio-history";

function formatElapsedLabel(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m <= 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function StatusPill({
  status,
}: {
  status: StudioHistoryItem["status"];
}) {
  const label = historyStatusLabel(status);
  const className =
    status === "generating"
      ? "bg-accent/15 text-accent"
      : status === "failed"
        ? "bg-red-500/15 text-red-300"
        : "bg-white/[0.06] text-fg-subtle";
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.6rem] font-medium tracking-wide",
        className,
      ].join(" ")}
    >
      {status === "generating" ? (
        <span
          className="h-2 w-2 animate-spin rounded-full border border-accent/30 border-t-accent"
          aria-hidden
        />
      ) : null}
      {label}
    </span>
  );
}

export function StudioHistoryPanel({
  items,
  onSelect,
  onDownload,
  onDelete,
  emptyHint,
  activeElapsedSec = 0,
}: {
  items: StudioHistoryItem[];
  onSelect: (item: StudioHistoryItem) => void;
  onDownload: (item: StudioHistoryItem) => void;
  onDelete?: (item: StudioHistoryItem) => void;
  emptyHint?: string;
  /** Live elapsed seconds for the in-flight generating row. */
  activeElapsedSec?: number;
}) {
  if (items.length === 0) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/[0.08] bg-white/[0.015] px-6 text-center">
        <p className="text-sm font-medium text-fg">No videos yet</p>
        <p className="max-w-xs text-[0.7rem] text-fg-subtle">
          {emptyHint ??
            "Generated clips appear here, including in-progress and failed runs."}
        </p>
      </div>
    );
  }

  const ordered = sortStudioHistoryNewestFirst(items);

  return (
    <ul className="space-y-1.5 overflow-y-auto [scrollbar-width:thin]">
      {ordered.map((item) => {
        const isGenerating = item.status === "generating";
        const isFailed = item.status === "failed";
        const canPreview = item.status === "done" && Boolean(item.videoUrl);
        const elapsedLabel = isGenerating
          ? formatElapsedLabel(activeElapsedSec)
          : item.elapsedSec != null
            ? formatElapsedLabel(item.elapsedSec)
            : null;

        return (
          <li key={item.id}>
            <div
              className={[
                "flex items-stretch gap-2.5 rounded-lg border px-2 py-2 transition-colors",
                isGenerating
                  ? "border-accent/20 bg-accent/[0.04]"
                  : isFailed
                    ? "border-red-400/15 bg-red-500/[0.04]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => canPreview && onSelect(item)}
                disabled={!canPreview}
                className={[
                  "relative aspect-video h-[3.75rem] w-[6.75rem] shrink-0 overflow-hidden rounded-md border border-white/[0.08] bg-black",
                  canPreview ? "" : "cursor-default",
                ].join(" ")}
                aria-label={
                  canPreview
                    ? `Open ${item.title}`
                    : `${historyStatusLabel(item.status)}: ${item.title}`
                }
              >
                {canPreview ? (
                  <>
                    <video
                      src={item.videoUrl}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/85">
                        <span className="ml-0.5 h-0 w-0 border-y-[4px] border-l-[7px] border-y-transparent border-l-[#0a0a0c]" />
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center">
                    {isGenerating ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent/25 border-t-accent" />
                    ) : (
                      <span className="text-[0.65rem] font-medium text-fg-subtle">
                        {isFailed ? "Failed" : "—"}
                      </span>
                    )}
                  </span>
                )}
              </button>

              <div className="min-w-0 flex-1 py-0.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-[0.8rem] font-medium text-fg">
                    {item.title}
                  </p>
                  <StatusPill status={item.status} />
                </div>
                <p className="mt-0.5 text-[0.65rem] text-fg-subtle">
                  {formatHistoryWhen(item.createdAt)}
                  {item.durationSec > 0 ? ` · ${item.durationSec}s` : ""}
                  {item.resolution ? ` · ${item.resolution}` : ""}
                  {` · ${item.modelMark}`}
                  {elapsedLabel ? ` · ${elapsedLabel}` : ""}
                </p>
                {isFailed && item.errorMessage ? (
                  <p className="mt-1 line-clamp-2 text-[0.65rem] text-red-300/90">
                    {item.errorMessage}
                  </p>
                ) : null}
                {isGenerating ? (
                  <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                    <div className="h-full w-1/3 animate-pulse rounded-full bg-accent" />
                  </div>
                ) : null}
              </div>

              <div className="flex shrink-0 flex-col justify-center gap-1 self-center">
                <button
                  type="button"
                  onClick={() => onDownload(item)}
                  disabled={!canPreview}
                  className="min-w-[4.25rem] rounded-md border border-white/[0.1] bg-white/[0.04] px-2 py-1 text-[0.65rem] font-medium text-fg transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!onDelete || isGenerating) return;
                    const ok = window.confirm(
                      `Delete “${item.title}”? This cannot be undone.`,
                    );
                    if (ok) onDelete(item);
                  }}
                  disabled={!onDelete || isGenerating}
                  className="min-w-[4.25rem] rounded-md px-2 py-1 text-[0.65rem] font-medium text-fg-subtle transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
