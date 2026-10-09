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
    <div className="flex items-center gap-2">
      {trailing ? (
        <div className="mr-auto min-w-0 truncate text-[0.7rem] text-fg-subtle">
          {trailing}
        </div>
      ) : (
        <span className="mr-auto" aria-hidden="true" />
      )}
      <div
        className="ml-auto inline-flex shrink-0 rounded-full border border-white/[0.1] bg-black/30 p-0.5"
        role="tablist"
        aria-label="Preview panel"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "preview"}
          onClick={() => onModeChange("preview")}
          className={[
            "rounded-full px-3 py-1.5 text-[0.7rem] font-medium transition",
            mode === "preview"
              ? "bg-white/[0.1] font-semibold text-fg shadow-sm"
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
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.7rem] font-medium transition",
            mode === "history"
              ? "bg-white/[0.1] font-semibold text-fg shadow-sm"
              : "text-fg-subtle hover:text-fg",
          ].join(" ")}
        >
          History
          {historyBusy ? (
            <span
              className="h-2.5 w-2.5 animate-spin rounded-full border border-accent/35 border-t-accent"
              aria-label="Generation in progress"
            />
          ) : historyCount > 0 ? (
            <span className="rounded-full bg-white/[0.1] px-1.5 py-px text-[0.6rem] tabular-nums text-fg-subtle">
              {historyCount > 99 ? "99+" : historyCount}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
}
