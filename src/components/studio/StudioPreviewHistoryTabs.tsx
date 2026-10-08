"use client";

export type StudioPanelMode = "preview" | "history";

export function StudioPreviewHistoryTabs({
  mode,
  onModeChange,
  trailing,
}: {
  mode: StudioPanelMode;
  onModeChange: (mode: StudioPanelMode) => void;
  trailing?: React.ReactNode;
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
            "rounded-full px-3 py-1.5 text-[0.7rem] font-medium transition",
            mode === "history"
              ? "bg-white/[0.1] font-semibold text-fg shadow-sm"
              : "text-fg-subtle hover:text-fg",
          ].join(" ")}
        >
          History
        </button>
      </div>
    </div>
  );
}
