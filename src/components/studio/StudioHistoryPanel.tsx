"use client";

import {
  formatHistoryWhen,
  type StudioHistoryItem,
} from "@/lib/studio-history";

export function StudioHistoryPanel({
  items,
  onSelect,
  onDownload,
  emptyHint,
}: {
  items: StudioHistoryItem[];
  onSelect: (item: StudioHistoryItem) => void;
  onDownload: (item: StudioHistoryItem) => void;
  emptyHint?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-black/30 px-6 text-center">
        <p className="text-sm font-medium text-fg">No videos yet</p>
        <p className="text-[0.7rem] text-fg-subtle">
          {emptyHint ??
            "Your generated clips will show up here. Sign in so credits and history stay with your account."}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2 overflow-y-auto [scrollbar-width:thin]">
      {items.map((item) => (
        <li key={item.id}>
          <div className="flex gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-2 transition hover:border-white/[0.14] hover:bg-white/[0.05]">
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="relative aspect-video h-[4.25rem] w-[7.5rem] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black"
              aria-label={`Open ${item.title}`}
            >
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
            </button>
            <div className="min-w-0 flex-1 py-0.5">
              <p className="truncate text-sm font-medium text-fg">{item.title}</p>
              <p className="mt-0.5 text-[0.65rem] text-fg-subtle">
                {formatHistoryWhen(item.createdAt)} · {item.durationSec}s ·{" "}
                {item.modelMark}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="rounded-full border border-white/12 px-2.5 py-0.5 text-[0.65rem] text-fg-muted transition hover:border-white/25 hover:text-fg"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => onDownload(item)}
                  className="rounded-full border border-accent/30 bg-[rgba(216,255,62,0.08)] px-2.5 py-0.5 text-[0.65rem] text-accent transition hover:bg-[rgba(216,255,62,0.14)]"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
