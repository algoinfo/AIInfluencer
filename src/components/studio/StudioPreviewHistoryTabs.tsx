"use client";

export type StudioPanelMode = "preview" | "history";

export function StudioPreviewHistoryTabs({
  mode,
  onModeChange,
  trailing,
  historyCount = 0,
  historyBusy = false,
}: {
  mode: StudioPanelMode;
  onModeChange: (mode: StudioPanelMode) => void;
  trailing?: React.ReactNode;
  historyCount?: number;
  historyBusy?: boolean;
}) {
  return (
    <div className="flex w-full items-center gap-3">
      <div
        className="inline-flex shrink-0 rounded-md bg-white/[0.04] p-0.5"
        role="tablist"
        aria-label="Preview panel"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "preview"}
          onClick={() => onModeChange("preview")}
          className={[
            "rounded px-2.5 py-1 text-[0.7rem] font-medium transition-colors",
            mode === "preview"
              ? "bg-white/[0.1] text-fg"
              : "text-fg-subtle hover:text-fg",
          ].join(" ")}
        >
          Preview
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "history"}
          onClick={() => onModeChange("history")}
          className={[
            "inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[0.7rem] font-medium transition-colors",
            mode === "history"
              ? "bg-white/[0.1] text-fg"
              : "text-fg-subtle hover:text-fg",
          ].join(" ")}
        >
          History
          {historyBusy ? (
            <span
              className="h-2 w-2 animate-spin rounded-full border border-accent/35 border-t-accent"
              aria-label="Generation in progress"
            />
          ) : historyCount > 0 ? (
            <span className="rounded bg-white/[0.08] px-1 py-px text-[0.6rem] tabular-nums text-fg-subtle">
              {historyCount > 99 ? "99+" : historyCount}
            </span>
          ) : null}
        </button>
      </div>
      {trailing ? (
        <div className="min-w-0 flex-1 truncate text-right text-[0.65rem] tabular-nums text-fg-subtle">
          {trailing}
        </div>
      ) : null}
    </div>
  );
}
