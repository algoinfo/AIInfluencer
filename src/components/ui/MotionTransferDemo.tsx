"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Slot = "character" | "reference" | null;

export function MotionTransferDemo() {
  const [characterName, setCharacterName] = useState<string | null>(null);
  const [referenceName, setReferenceName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "demo">("idle");

  function handlePick(slot: Slot, file?: File | null) {
    if (!file) return;
    if (slot === "character") setCharacterName(file.name);
    if (slot === "reference") setReferenceName(file.name);
    setStatus("idle");
  }

  function handleGenerate() {
    if (!characterName || !referenceName) {
      setStatus("ready");
      return;
    }
    setStatus("demo");
  }

  return (
    <div className="rounded-3xl border border-border bg-surface/70 p-5 sm:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <UploadSlot
          label="Your Character"
          hint="Upload Image"
          accept="image/*"
          fileName={characterName}
          onPick={(file) => handlePick("character", file)}
        />
        <UploadSlot
          label="Reference Video"
          hint="Upload Video"
          accept="video/*"
          fileName={referenceName}
          onPick={(file) => handlePick("reference", file)}
        />
      </div>

      <div className="my-8 flex flex-col items-center gap-3">
        <div className="flow-beam h-10 w-px bg-border-strong" />
        <span className="rounded-full border border-accent/35 bg-[rgba(216,255,62,0.08)] px-4 py-2 text-[0.7rem] uppercase tracking-[0.2em] text-accent">
          Motion Transfer
        </span>
        <div className="flow-beam h-10 w-px bg-border-strong" />
      </div>

      <div className="flex flex-col items-center gap-4 text-center">
        <Button type="button" size="lg" onClick={handleGenerate}>
          Generate Video
        </Button>
        <p className="max-w-md text-sm leading-relaxed text-fg-muted">
          Demo UI only — files stay in your browser. No video is generated yet.
          This preview shows the Genjutsu workflow shape.
        </p>
        {status === "ready" ? (
          <p className="text-sm text-accent">
            Add both a character image and a reference video to continue.
          </p>
        ) : null}
        {status === "demo" ? (
          <div className="w-full max-w-lg rounded-2xl border border-border bg-bg-soft p-5 text-left">
            <p className="text-xs uppercase tracking-[0.18em] text-fg-subtle">
              Demo status
            </p>
            <p className="mt-2 text-sm text-fg-muted">
              Character: <span className="text-fg">{characterName}</span>
              <br />
              Reference: <span className="text-fg">{referenceName}</span>
            </p>
            <p className="mt-3 text-sm text-fg-muted">
              Generation is not connected. Explore Examples to see the kind of
              results motion transfer can produce.
            </p>
            <div className="mt-4">
              <Button href="/examples" variant="secondary" size="md">
                See Examples
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function UploadSlot({
  label,
  hint,
  accept,
  fileName,
  onPick,
}: {
  label: string;
  hint: string;
  accept: string;
  fileName: string | null;
  onPick: (file: File | null) => void;
}) {
  return (
    <label className="group flex cursor-pointer flex-col rounded-2xl border border-dashed border-border-strong bg-bg-soft/80 p-6 transition-colors hover:border-accent/40 hover:bg-bg-soft">
      <span className="text-xs uppercase tracking-[0.18em] text-fg-subtle">
        {label}
      </span>
      <span className="font-display mt-6 text-xl font-semibold tracking-tight">
        {fileName || hint}
      </span>
      <span className="mt-2 text-sm text-fg-muted">
        {fileName ? "Click to replace" : "Click or drop a file"}
      </span>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => onPick(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}
