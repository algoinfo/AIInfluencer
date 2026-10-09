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
      ? "border-accent/35 bg-[rgba(216,255,62,0.1)] text-accent"
      : status === "failed"
        ? "border-red-400/30 bg-red-500/10 text-red-300"
        : "border-white/12 bg-white/[0.06] text-fg-subtle";
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide",
        className,
      ].join(" ")}
    >
      {status === "generating" ? (
        <span
          className="h-2.5 w-2.5 animate-spin rounded-full border border-accent/30 border-t-accent"
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
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-black/30 px-6 text-center">
        <p className="text-sm font-medium text-fg">No videos yet</p>
        <p className="text-[0.7rem] text-fg-subtle">
          {emptyHint ??
            "Your generated clips will show up here, including in-progress and failed runs."}
        </p>
      </div>
    );
  }

  const ordered = sortStudioHistoryNewestFirst(items);

  return (
    <ul className="space-y-2 overflow-y-auto [scrollbar-width:thin]">
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
                "flex items-stretch gap-3 rounded-xl border p-2 transition",
                isGenerating
                  ? "border-accent/25 bg-[rgba(216,255,62,0.04)]"
                  : isFailed
                    ? "border-red-400/20 bg-red-500/[0.04]"
                    : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => canPreview && onSelect(item)}
                disabled={!canPreview}
                className={[
                  "relative aspect-video h-[4.25rem] w-[7.5rem] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black",
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
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80">
                        <span className="ml-0.5 h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-[#0a0a0c]" />
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-2 text-center">
                    {isGenerating ? (
                      <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent/25 border-t-accent" />
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
                  <p className="truncate text-sm font-medium text-fg">
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
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
                    <div className="h-full w-1/3 animate-pulse rounded-full bg-accent" />
                  </div>
                ) : null}
              </div>

              <div className="flex shrink-0 flex-col justify-center gap-1.5 self-center">
                <button
                  type="button"
                  onClick={() => onDownload(item)}
                  disabled={!canPreview}
                  className="min-w-[4.5rem] rounded-full border border-accent/30 bg-[rgba(216,255,62,0.08)] px-2.5 py-1 text-[0.65rem] font-medium text-accent transition hover:bg-[rgba(216,255,62,0.14)] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(item)}
                  disabled={!onDelete || isGenerating}
                  className="min-w-[4.5rem] rounded-full border border-white/12 px-2.5 py-1 text-[0.65rem] font-medium text-fg-muted transition hover:border-red-400/35 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-35"
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
