"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  CREDITS_PER_SECOND,
  creditsForRun,
  durationOptions,
} from "@/data/credits";
import { resolveMotionPrompt } from "@/data/motion-prompt";

const models = [
  {
    id: "kling-v3-pro",
    name: "Kling V3 Pro Motion Control",
    meta: "Pro · ×1.5 credits",
    mark: "K3",
    multiplier: 1.5,
  },
  {
    id: "kling-v3-standard",
    name: "Kling V3 Standard Motion Control",
    meta: "Standard · ×1.2 credits",
    mark: "V3",
    multiplier: 1.2,
  },
  {
    id: "kling-v26-standard",
    name: "Kling V2.6 Standard Motion Control",
    meta: "Standard · ×1.0 credits",
    mark: "2.6",
    multiplier: 1,
  },
];

export function MotionStudio() {
  const { needsLoginToGenerate, openAuthModal } = useAuth();
  const [model, setModel] = useState(models[0]);
  const [duration, setDuration] = useState(durationOptions[1].seconds);
  const [open, setOpen] = useState(false);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "need" | "demo">("idle");
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const promptId = useId();

  const sellCredits = creditsForRun(duration, model.multiplier);
  const usingDefaultPrompt = prompt.trim().length === 0;

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  function onImage(file: File | null) {
    if (!file) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageName(file.name);
    setImageUrl(URL.createObjectURL(file));
    setStatus("idle");
  }

  function onVideo(file: File | null) {
    if (!file) return;
    setVideoName(file.name);
    setStatus("idle");
  }

  function onGenerate() {
    if (!imageName || !videoName) {
      setStatus("need");
      return;
    }
    if (needsLoginToGenerate()) {
      openAuthModal({ mode: "register", reason: "generation" });
      return;
    }
    setLastPrompt(resolveMotionPrompt(prompt));
    setStatus("demo");
  }

  const ready = Boolean(imageName && videoName);

  return (
    <div
      id="studio"
      className="animate-rise-delay-1 relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[1.25rem] border border-white/[0.1] bg-[linear-gradient(180deg,rgba(22,22,26,0.95),rgba(10,10,12,0.98))] shadow-[0_40px_100px_rgba(0,0,0,0.55)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(216,255,62,0.06),transparent_45%),radial-gradient(ellipse_at_90%_20%,rgba(255,255,255,0.04),transparent_40%)]" />

      <div className="relative grid min-h-0 flex-1 grid-rows-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:grid-rows-1 lg:grid-cols-[340px_1fr] xl:grid-cols-[360px_1fr]">
        {/* Left tools */}
        <div className="flex min-h-0 flex-col border-b border-white/[0.07] lg:border-b-0 lg:border-r lg:border-white/[0.07]">
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3.5 sm:p-4 [scrollbar-width:thin]">
            {/* Model */}
            <div ref={menuRef} className="relative shrink-0">
              <p className="mb-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-fg-subtle">
                Model
              </p>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-2.5 text-left transition-colors hover:border-white/[0.18] hover:bg-white/[0.06]"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-accent px-1.5 font-display text-[0.6rem] font-semibold leading-none text-[#0a0a0c]">
                    {model.mark}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.8rem] font-medium text-fg">
                      {model.name}
                    </span>
                    <span className="block text-[0.7rem] text-fg-subtle">
                      {model.meta}
                    </span>
                  </span>
                </span>
                <Chevron open={open} />
              </button>

              {open ? (
                <ul
                  id={listId}
                  role="listbox"
                  className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#141416] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  {models.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={item.id === model.id}
                        onClick={() => {
                          setModel(item);
                          setOpen(false);
                        }}
                        className={[
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                          item.id === model.id
                            ? "bg-white/[0.08]"
                            : "hover:bg-white/[0.04]",
                        ].join(" ")}
                      >
                        <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-accent/90 px-1 font-display text-[0.6rem] font-semibold leading-none text-[#0a0a0c]">
                          {item.mark}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-fg">
                            {item.name}
                          </span>
                          <span className="block text-xs text-fg-subtle">
                            {item.meta} ·{" "}
                            {creditsForRun(
                              duration,
                              item.multiplier,
                            ).toLocaleString()}{" "}
                            cr / {duration}s
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {/* Uploads side by side */}
            <div className="grid shrink-0 grid-cols-2 gap-2.5">
              <UploadField
                label="Character"
                required
                hint="JPG / PNG"
                button="Add image"
                accept="image/*"
                fileName={imageName}
                previewUrl={imageUrl}
                onPick={onImage}
                icon="image"
                compact
              />
              <UploadField
                label="Motion"
                required
                hint="MP4 / MOV"
                button="Add video"
                accept="video/*"
                fileName={videoName}
                onPick={onVideo}
                icon="video"
                compact
              />
            </div>

            {/* Prompt */}
            <div className="shrink-0">
              <label
                htmlFor={promptId}
                className="mb-1.5 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.16em] text-fg-subtle"
              >
                Prompt
                <span className="normal-case tracking-normal text-fg-subtle/80">
                  (optional)
                </span>
              </label>
              <textarea
                id={promptId}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="1. Look  2. Outfit  3. Scene  4. Keep the same  5. Final style"
                className="w-full resize-none rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-2.5 text-[0.8rem] leading-relaxed text-fg outline-none transition placeholder:text-fg-subtle/65 focus:border-accent/35 focus:bg-white/[0.06]"
              />
            </div>

            {/* Duration */}
            <div className="shrink-0">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <p className="text-[0.65rem] uppercase tracking-[0.16em] text-fg-subtle">
                  Duration
                </p>
                <p className="text-[0.65rem] text-fg-subtle">
                  {CREDITS_PER_SECOND} cr/s · ×{model.multiplier}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-white/[0.08] bg-black/25 p-1">
                {durationOptions.map((option) => {
                  const active = option.seconds === duration;
                  return (
                    <button
                      key={option.seconds}
                      type="button"
                      onClick={() => setDuration(option.seconds)}
                      className={[
                        "rounded-lg px-1 py-2 text-center text-xs font-medium transition-colors",
                        active
                          ? "bg-accent text-[#0a0a0c]"
                          : "text-fg-muted hover:bg-white/[0.05] hover:text-fg",
                      ].join(" ")}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky generate */}
          <div className="shrink-0 border-t border-white/[0.07] p-3.5 sm:p-4">
            <button
              type="button"
              onClick={onGenerate}
              className={[
                "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all",
                ready
                  ? "bg-accent text-[#0a0a0c] shadow-[0_0_36px_rgba(216,255,62,0.22)] hover:bg-accent-strong"
                  : "bg-white text-[#0a0a0c] hover:bg-white/90",
              ].join(" ")}
            >
              Generate · {duration}s · {sellCredits.toLocaleString()} credits
            </button>
            <p
              className={[
                "mt-2 text-center text-[0.7rem] leading-tight",
                status === "need" ? "text-accent" : "text-fg-subtle",
              ].join(" ")}
            >
              {status === "need"
                ? "Add a character image and motion video first."
                : status === "demo"
                  ? `Demo · ${duration}s · ${model.mark}${lastPrompt ? (usingDefaultPrompt ? " · default prompt" : " · custom prompt") : ""}.`
                  : "Demo UI · files stay in browser"}
            </p>
          </div>
        </div>

        {/* Right preview */}
        <div className="relative flex min-h-0 flex-col p-3 sm:p-4">
          <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[0.75rem]">
              <span className="font-medium text-fg">Preview</span>
              <span className="text-fg-subtle">
                {duration}s · {model.mark}
              </span>
            </div>
            {ready ? (
              <span className="rounded-full border border-accent/30 bg-[rgba(216,255,62,0.08)] px-2 py-0.5 text-[0.65rem] text-accent">
                Ready to generate
              </span>
            ) : (
              <span className="text-[0.65rem] text-fg-subtle">
                Add character + motion
              </span>
            )}
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-white/[0.1] bg-[#0a0a0c]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(40,48,56,0.9),#0a0a0c_70%)]" />
            <div className="absolute inset-0 opacity-40 video-shimmer bg-[linear-gradient(125deg,#16161a_0%,#222228_40%,#121216_70%,#1a1a20_100%)] bg-[length:200%_200%]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.7)_100%)]" />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <button
                type="button"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-md transition-transform hover:scale-105"
                aria-label="Preview placeholder"
              >
                <div className="ml-0.5 h-0 w-0 border-y-[7px] border-l-[12px] border-y-transparent border-l-fg" />
              </button>
              <div>
                <p className="text-sm font-medium text-fg">
                  {status === "demo"
                    ? "Generation placeholder"
                    : "Your AI video preview"}
                </p>
                <p className="mt-1 text-[0.7rem] text-fg-subtle">
                  {status === "demo"
                    ? "Connect generation to see the result here"
                    : "Output appears here after you generate"}
                </p>
              </div>
            </div>

            {imageUrl ? (
              <div className="absolute bottom-3 left-3 overflow-hidden rounded-lg border border-white/20 shadow-lg">
                <div className="relative h-14 w-11">
                  <Image
                    src={imageUrl}
                    alt="Character"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadField({
  label,
  required,
  hint,
  button,
  accept,
  fileName,
  previewUrl,
  onPick,
  icon,
  compact,
}: {
  label: string;
  required?: boolean;
  hint: string;
  button: string;
  accept: string;
  fileName: string | null;
  previewUrl?: string | null;
  onPick: (file: File | null) => void;
  icon: "image" | "video";
  compact?: boolean;
}) {
  const filled = Boolean(fileName);

  if (compact) {
    return (
      <label
        className={[
          "group flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition-all",
          filled
            ? "border-accent/25 bg-[rgba(216,255,62,0.04)]"
            : "border-dashed border-white/[0.12] bg-white/[0.025] hover:border-white/[0.22] hover:bg-white/[0.045]",
        ].join(" ")}
      >
        <div
          className={[
            "relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border",
            filled
              ? "border-accent/30 bg-black/30"
              : "border-white/10 bg-black/25 text-fg-muted group-hover:text-fg",
          ].join(" ")}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <UploadIcon type={icon} />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[0.6rem] uppercase tracking-[0.14em] text-fg-subtle">
            {label}
            {required ? <span className="ml-0.5 text-[#ff5c5c]">*</span> : null}
          </p>
          <p className="mt-0.5 truncate text-[0.75rem] font-medium text-fg">
            {fileName ? "Ready" : button}
          </p>
          <p className="truncate text-[0.6rem] text-fg-subtle">
            {fileName ? "Replace" : hint}
          </p>
        </div>
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />
      </label>
    );
  }

  return (
    <label
      className={[
        "group block shrink-0 cursor-pointer rounded-lg border px-2.5 py-2 transition-all",
        filled
          ? "border-accent/25 bg-[rgba(216,255,62,0.04)]"
          : "border-dashed border-white/[0.12] bg-white/[0.025] hover:border-white/[0.22] hover:bg-white/[0.045]",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <div
          className={[
            "relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border",
            filled
              ? "border-accent/30 bg-black/30"
              : "border-white/10 bg-black/25 text-fg-muted group-hover:text-fg",
          ].join(" ")}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <UploadIcon type={icon} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[0.6rem] uppercase tracking-[0.16em] text-fg-subtle">
            {label}
            {required ? <span className="ml-1 text-[#ff5c5c]">*</span> : null}
          </p>
          <p className="truncate text-[0.8rem] font-medium text-fg">
            {fileName || button}
          </p>
          <p className="truncate text-[0.65rem] text-fg-subtle">
            {fileName ? "Click to replace" : hint}
          </p>
        </div>
      </div>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}

function UploadIcon({ type }: { type: "image" | "video" }) {
  if (type === "video") {
    return (
      <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden>
        <rect
          x="1.5"
          y="3"
          width="8"
          height="8"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M9.5 6.2 12.5 4.5v5L9.5 7.8V6.2Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect
        x="1.5"
        y="2.5"
        width="11"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="5" cy="5.5" r="1" fill="currentColor" />
      <path
        d="M1.8 10.2 5.2 7.2l2.2 2 2-1.6 2.8 2.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={[
        "text-fg-muted transition-transform",
        open ? "rotate-180" : "",
      ].join(" ")}
    >
      <path
        d="M3.5 5.5 7 9l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
