"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { StudioHistoryPanel } from "@/components/studio/StudioHistoryPanel";
import {
  StudioPreviewHistoryTabs,
  type StudioPanelMode,
} from "@/components/studio/StudioPreviewHistoryTabs";
import { CREDITS_PER_SECOND, creditsForRun } from "@/data/credits";
import {
  creditsForGenjutsuRun,
  GENJUTSU_DEFAULT_RESOLUTION,
  GENJUTSU_MAX_REFERENCE_IMAGES,
  GENJUTSU_MIN_DURATION_SEC,
  GENJUTSU_RESOLUTIONS,
  genjutsuCreditsPerSecond,
  OBJECT_SWAP_MIN_FRAME_PIXELS,
  type GenjutsuResolution,
} from "@/data/genjutsu-pricing";
import { resolveMotionPrompt } from "@/data/motion-prompt";
import { probeVideoFileMeta } from "@/lib/probe-video-duration-client";
import {
  billableSecondsFromDuration,
  MOTION_TRANSFER_MAX_DURATION_SEC,
} from "@/lib/probe-video-duration";
import {
  loadStudioHistory,
  prependStudioHistory,
  type StudioHistoryItem,
} from "@/lib/studio-history";

type ReferenceAsset = {
  id: string;
  file: File;
  url: string;
  name: string;
};

function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type StudioMode = "object-swap" | "motion-transfer";

const MODE_TABS: { id: StudioMode; label: string }[] = [
  { id: "motion-transfer", label: "Motion Transfer" },
  { id: "object-swap", label: "Object Swap" },
];

/** Idle preview sample shown before the user generates. */
const DEMO_PREVIEW_VIDEO =
  "https://pub-3a51eee0bcba4124b258f45bbbe4d181.r2.dev/demo/two-cats-dance.mp4";

type StudioModel = {
  id: string;
  name: string;
  meta: string;
  mark: string;
  multiplier: number;
  provider: "higgsfield" | "fal";
};

const models: StudioModel[] = [
  {
    id: "genjutsu",
    name: "genjutsu",
    meta: "Higgsfield · by resolution",
    mark: "gj",
    multiplier: 1,
    provider: "higgsfield",
  },
  {
    id: "kling-v3-pro",
    name: "Kling V3 Pro Motion Control",
    meta: "Pro · ×1.5 credits",
    mark: "K3",
    multiplier: 1.5,
    provider: "fal",
  },
  {
    id: "kling-v3-standard",
    name: "Kling V3 Standard Motion Control",
    meta: "Standard · ×1.2 credits",
    mark: "V3",
    multiplier: 1.2,
    provider: "fal",
  },
  {
    id: "kling-v26-standard",
    name: "Kling V2.6 Standard Motion Control",
    meta: "Standard · ×1.0 credits",
    mark: "2.6",
    multiplier: 1,
    provider: "fal",
  },
];

export function MotionStudio() {
  const { isLoggedIn, openAuthModal, refreshSession } = useAuth();
  const [studioMode, setStudioMode] = useState<StudioMode>("motion-transfer");
  const [resolution, setResolution] = useState<GenjutsuResolution>(
    GENJUTSU_DEFAULT_RESOLUTION,
  );
  const [model, setModel] = useState(
    () => models.find((m) => m.id === "genjutsu") ?? models[0],
  );
  const [open, setOpen] = useState(false);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  /** Object Swap: up to 8 HF image_urls (first also mirrors imageFile for shared UI). */
  const [referenceAssets, setReferenceAssets] = useState<ReferenceAsset[]>([]);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDurationSec, setVideoDurationSec] = useState<number | null>(null);
  const [videoFramePixels, setVideoFramePixels] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [promptOn, setPromptOn] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "need" | "generating" | "done" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<StudioPanelMode>("preview");
  const [history, setHistory] = useState<StudioHistoryItem[]>([]);
  const [elapsedSec, setElapsedSec] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const promptId = useId();

  const duration = videoDurationSec;
  const isObjectSwap = studioMode === "object-swap";
  const isGenjutsuMotion =
    !isObjectSwap && model.provider === "higgsfield";
  const usesGenjutsuPricing = isObjectSwap || isGenjutsuMotion;
  const sellCredits =
    duration == null
      ? null
      : usesGenjutsuPricing
        ? creditsForGenjutsuRun(duration, resolution)
        : creditsForRun(duration, model.multiplier);
  const usingDefaultPrompt = !promptOn || prompt.trim().length === 0;
  const modelMark = isObjectSwap ? "gj" : model.mark;

  useEffect(() => {
    setHistory(loadStudioHistory());
  }, []);

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
      for (const asset of referenceAssets) URL.revokeObjectURL(asset.url);
      if (resultUrl?.startsWith("blob:")) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revoke only on unmount / replace via setters
  }, []);

  useEffect(() => {
    if (status !== "generating") {
      setElapsedSec(0);
      return;
    }
    setElapsedSec(0);
    const startedAt = Date.now();
    const id = window.setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);
    return () => window.clearInterval(id);
  }, [status]);

  function syncPrimaryImage(file: File | null, preview: string | null) {
    if (imageUrl && imageUrl !== preview) URL.revokeObjectURL(imageUrl);
    setImageName(file?.name ?? null);
    setImageFile(file);
    setImageUrl(preview);
  }

  function onImage(file: File | null) {
    if (!file) return;
    if (isObjectSwap) {
      if (referenceAssets.length >= GENJUTSU_MAX_REFERENCE_IMAGES) {
        setStatus("error");
        setErrorMessage(
          `Object Swap supports up to ${GENJUTSU_MAX_REFERENCE_IMAGES} reference images.`,
        );
        return;
      }
      const url = URL.createObjectURL(file);
      const asset: ReferenceAsset = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        url,
        name: file.name,
      };
      setReferenceAssets((prev) => {
        const next = [...prev, asset].slice(0, GENJUTSU_MAX_REFERENCE_IMAGES);
        const primary = next[0];
        syncPrimaryImage(primary?.file ?? null, primary?.url ?? null);
        return next;
      });
    } else {
      syncPrimaryImage(file, URL.createObjectURL(file));
    }
    setStatus("idle");
    setErrorMessage(null);
  }

  function removeReference(id: string) {
    setReferenceAssets((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) URL.revokeObjectURL(target.url);
      const next = prev.filter((a) => a.id !== id);
      const primary = next[0];
      syncPrimaryImage(primary?.file ?? null, primary?.url ?? null);
      return next;
    });
    setStatus("idle");
    setErrorMessage(null);
  }

  function onVideo(file: File | null) {
    if (!file) return;
    setVideoName(file.name);
    setVideoFile(file);
    setVideoDurationSec(null);
    setVideoFramePixels(null);
    setStatus("idle");
    setErrorMessage(null);

    void probeVideoFileMeta(file).then((meta) => {
      const raw = meta?.durationSec ?? null;
      if (raw != null && raw > MOTION_TRANSFER_MAX_DURATION_SEC + 0.05) {
        setVideoFile(null);
        setVideoName(null);
        setVideoDurationSec(null);
        setVideoFramePixels(null);
        setStatus("error");
        setErrorMessage(
          `Motion video is too long (max ${MOTION_TRANSFER_MAX_DURATION_SEC}s).`,
        );
        return;
      }
      if (
        isObjectSwap &&
        meta &&
        meta.framePixels > 0 &&
        meta.framePixels < OBJECT_SWAP_MIN_FRAME_PIXELS
      ) {
        setVideoFile(null);
        setVideoName(null);
        setVideoDurationSec(null);
        setVideoFramePixels(null);
        setStatus("error");
        setErrorMessage(
          "Source video resolution is too low for Object Swap (need about 854×480 or larger).",
        );
        return;
      }
      const billable = billableSecondsFromDuration(raw ?? 0);
      setVideoDurationSec(billable);
      setVideoFramePixels(meta?.framePixels ?? null);
      if (billable == null) {
        setStatus("error");
        setErrorMessage(
          "Could not read video length. Try another MP4 / MOV file.",
        );
      }
    });
  }

  async function onGenerate() {
    if (!isLoggedIn) {
      openAuthModal({ mode: "login", reason: "generation" });
      return;
    }
    const swapRefs = isObjectSwap ? referenceAssets.map((a) => a.file) : [];
    const primaryImage = isObjectSwap ? swapRefs[0] ?? null : imageFile;
    if (!primaryImage || !videoFile) {
      setStatus("need");
      return;
    }
    if (duration == null) {
      setStatus("error");
      setErrorMessage(
        "Could not read video length. Try another MP4 / MOV file.",
      );
      return;
    }
    if (usesGenjutsuPricing && duration < GENJUTSU_MIN_DURATION_SEC) {
      setStatus("error");
      setErrorMessage(
        `Genjutsu needs a video at least ${GENJUTSU_MIN_DURATION_SEC}s long.`,
      );
      return;
    }

    const resolved = usesGenjutsuPricing
      ? promptOn
        ? prompt.trim()
        : ""
      : resolveMotionPrompt(promptOn ? prompt : "");
    setLastPrompt(resolved || null);
    setErrorMessage(null);
    setStatus("generating");
    setPanelMode("preview");

    if (resultUrl?.startsWith("blob:")) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);

    try {
      const form = new FormData();
      form.set("mode", studioMode);
      form.set("modelId", isObjectSwap ? "genjutsu" : model.id);
      if (isObjectSwap) {
        for (const file of swapRefs) {
          form.append("referenceImage", file);
        }
      } else {
        form.set("characterImage", primaryImage);
      }
      form.set("motionVideo", videoFile);
      form.set("prompt", resolved);
      form.set("durationSec", String(duration));
      form.set("modelMultiplier", String(model.multiplier));
      form.set("resolution", resolution);
      if (videoFramePixels != null && videoFramePixels > 0) {
        form.set("framePixels", String(videoFramePixels));
      }

      const res = await fetch("/api/video/generate", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
          needsLogin?: boolean;
          needsCredits?: boolean;
        } | null;
        if (res.status === 403 && data?.needsLogin) {
          openAuthModal({ mode: "register", reason: "generation" });
          setStatus("idle");
          return;
        }
        if (res.status === 402 && data?.needsCredits) {
          setStatus("error");
          setErrorMessage(
            data.error ||
              "Not enough credits. Buy a pack on Pricing to continue.",
          );
          return;
        }
        throw new Error(data?.error || "Generation failed.");
      }

      const publicUrl = res.headers.get("X-Video-Url");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      setResultUrl(blobUrl);
      setStatus("done");
      setPanelMode("preview");

      const item: StudioHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title:
          primaryImage.name.replace(/\.[^.]+$/, "") ||
          (isObjectSwap ? "Object swap" : "Motion transfer"),
        createdAt: new Date().toISOString(),
        // Prefer public R2 URL for reload-safe history; blob for this session.
        videoUrl: publicUrl || blobUrl,
        durationSec: duration,
        modelMark: modelMark,
      };
      setHistory((prev) => {
        const next = prependStudioHistory(prev, item);
        // Keep blob entry visible this session even if not persisted.
        if (!publicUrl) return [item, ...prev.filter((h) => h.id !== item.id)].slice(0, 24);
        return next;
      });
      void refreshSession();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Generation failed.",
      );
    }
  }

  const downloadResult = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "genjutsu-motion.mp4";
    a.click();
  }, [resultUrl]);

  const openHistoryItem = useCallback((item: StudioHistoryItem) => {
    setResultUrl(item.videoUrl);
    setStatus("done");
    setPanelMode("preview");
  }, []);

  const downloadHistoryItem = useCallback((item: StudioHistoryItem) => {
    const a = document.createElement("a");
    a.href = item.videoUrl;
    a.download = `genjutsu-${item.id}.mp4`;
    a.click();
  }, []);

  const ready = Boolean(
    (isObjectSwap ? referenceAssets.length > 0 : imageFile) &&
      videoFile &&
      duration != null,
  );
  const busy = status === "generating";

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
            {/* Mode tabs */}
            <div
              className="grid shrink-0 grid-cols-2 gap-1 rounded-xl border border-white/[0.1] bg-black/30 p-1"
              role="tablist"
              aria-label="Studio mode"
            >
              {MODE_TABS.map((tab) => {
                const active = studioMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setStudioMode(tab.id);
                      setOpen(false);
                      setStatus("idle");
                      setErrorMessage(null);
                      if (tab.id === "motion-transfer") {
                        setModel(
                          models.find((m) => m.id === "genjutsu") ?? models[0],
                        );
                        // Flatten multi-refs down to the primary character image.
                        setReferenceAssets((prev) => {
                          for (const asset of prev.slice(1)) {
                            URL.revokeObjectURL(asset.url);
                          }
                          return prev[0] ? [prev[0]] : [];
                        });
                      } else if (
                        tab.id === "object-swap" &&
                        imageFile &&
                        referenceAssets.length === 0
                      ) {
                        const url = imageUrl || URL.createObjectURL(imageFile);
                        setReferenceAssets([
                          {
                            id: `seed-${Date.now()}`,
                            file: imageFile,
                            url,
                            name: imageFile.name,
                          },
                        ]);
                        if (!imageUrl) setImageUrl(url);
                      }
                    }}
                    className={[
                      "rounded-lg px-2 py-2 text-center text-[0.72rem] font-semibold tracking-tight transition-colors",
                      active
                        ? "bg-accent text-accent-ink"
                        : "text-fg-subtle hover:bg-white/[0.05] hover:text-fg",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Object Swap: no model picker — fixed Genjutsu object-swap API */}
            {isObjectSwap ? (
              <div className="shrink-0">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.16em] text-fg-subtle">
                    Resolution
                  </p>
                  <p className="text-[0.65rem] text-fg-subtle">
                    {genjutsuCreditsPerSecond(resolution).toLocaleString()} cr/s
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/[0.08] bg-black/25 p-1">
                  {GENJUTSU_RESOLUTIONS.map((option) => {
                    const active = option === resolution;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setResolution(option)}
                        className={[
                          "rounded-lg px-1 py-2 text-center text-xs font-medium transition-colors",
                          active
                            ? "bg-accent text-[#0a0a0c]"
                            : "text-fg-muted hover:bg-white/[0.05] hover:text-fg",
                        ].join(" ")}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="shrink-0 space-y-2.5">
                <div ref={menuRef} className="relative">
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
                          {isGenjutsuMotion
                            ? `${genjutsuCreditsPerSecond(resolution).toLocaleString()} cr/s · ${resolution}`
                            : model.meta}
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
                      {models.map((item) => {
                        const itemCredits =
                          item.provider === "higgsfield"
                            ? duration != null
                              ? creditsForGenjutsuRun(duration, resolution)
                              : genjutsuCreditsPerSecond(resolution)
                            : duration != null
                              ? creditsForRun(duration, item.multiplier)
                              : Math.round(
                                  CREDITS_PER_SECOND * item.multiplier,
                                );
                        return (
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
                                  {item.meta}
                                  {duration != null
                                    ? ` · ${itemCredits.toLocaleString()} cr / ${duration}s`
                                    : ` · ${itemCredits.toLocaleString()} cr/s`}
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>

                {isGenjutsuMotion ? (
                  <div>
                    <p className="mb-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-fg-subtle">
                      Resolution
                    </p>
                    <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/[0.08] bg-black/25 p-1">
                      {GENJUTSU_RESOLUTIONS.map((option) => {
                        const active = option === resolution;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setResolution(option)}
                            className={[
                              "rounded-lg px-1 py-2 text-center text-xs font-medium transition-colors",
                              active
                                ? "bg-accent text-[#0a0a0c]"
                                : "text-fg-muted hover:bg-white/[0.05] hover:text-fg",
                            ].join(" ")}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Uploads — Object Swap: 1–8 refs + source video (HF image_urls / video_url) */}
            {isObjectSwap ? (
              <div className="shrink-0 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.16em] text-fg-subtle">
                    References
                    <span className="ml-0.5 text-[#ff5c5c]">*</span>
                  </p>
                  <p className="text-[0.65rem] text-fg-subtle">
                    {referenceAssets.length}/{GENJUTSU_MAX_REFERENCE_IMAGES}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {referenceAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="relative overflow-hidden rounded-xl border border-accent/25 bg-[rgba(216,255,62,0.04)]"
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={asset.url}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${asset.name}`}
                        onClick={() => removeReference(asset.id)}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-sm leading-none text-fg hover:bg-black"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {referenceAssets.length < GENJUTSU_MAX_REFERENCE_IMAGES ? (
                    <UploadField
                      label="Add"
                      hint="JPG / PNG"
                      button="Image"
                      accept="image/jpeg,image/png,image/webp"
                      fileName={null}
                      onPick={onImage}
                      icon="image"
                      compact
                    />
                  ) : null}
                </div>
                <UploadField
                  label="Source video"
                  required
                  hint={
                    duration != null
                      ? `${duration}s · billable`
                      : "MP4 / MOV · ≥4s"
                  }
                  button="Add video"
                  accept="video/*"
                  fileName={videoName}
                  onPick={onVideo}
                  icon="video"
                />
              </div>
            ) : (
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
                  hint={
                    duration != null
                      ? `${duration}s · billable`
                      : "MP4 / MOV"
                  }
                  button="Add video"
                  accept="video/*"
                  fileName={videoName}
                  onPick={onVideo}
                  icon="video"
                  compact
                />
              </div>
            )}

            {/* Prompt — toggle like Genjutsu studio */}
            <div className="shrink-0">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor={promptId}
                  className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.16em] text-fg-subtle"
                >
                  Prompt
                  <span className="normal-case tracking-normal text-fg-subtle/80">
                    {promptOn
                      ? "custom"
                      : usesGenjutsuPricing
                        ? "optional"
                        : "default"}
                  </span>
                </label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={promptOn}
                  aria-label="Enable custom prompt"
                  onClick={() => setPromptOn((v) => !v)}
                  className={[
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
                    promptOn
                      ? "bg-accent"
                      : "bg-white/[0.12] ring-1 ring-inset ring-white/[0.08]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                      promptOn
                        ? "translate-x-5 bg-accent-ink"
                        : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
              </div>
              {promptOn ? (
                <textarea
                  id={promptId}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  placeholder={
                    usesGenjutsuPricing
                      ? isObjectSwap
                        ? "Describe what to swap or keep…"
                        : "Optional style / character notes…"
                      : "1. Look  2. Outfit  3. Scene  4. Keep the same  5. Final style"
                  }
                  className="w-full resize-none rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-2.5 text-[0.8rem] leading-relaxed text-fg outline-none transition placeholder:text-fg-subtle/65 focus:border-accent/35 focus:bg-white/[0.06]"
                />
              ) : null}
            </div>
          </div>

          {/* Sticky generate */}
          <div className="shrink-0 border-t border-white/[0.07] p-3.5 sm:p-4">
            <button
              type="button"
              onClick={() => void onGenerate()}
              disabled={busy}
              className={[
                "group relative flex h-12 w-full items-center justify-between gap-3 overflow-hidden rounded-2xl px-4 text-left transition-all duration-200 disabled:cursor-wait",
                ready
                  ? "bg-accent text-accent-ink shadow-[0_8px_28px_rgba(216,255,62,0.18)] hover:bg-accent-strong hover:shadow-[0_10px_32px_rgba(216,255,62,0.28)] active:scale-[0.985]"
                  : "bg-white/[0.08] text-fg ring-1 ring-inset ring-white/[0.1] hover:bg-white/[0.12]",
                busy ? "opacity-90" : "",
              ].join(" ")}
            >
              {ready ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition duration-500 group-hover:translate-x-[220%] group-hover:opacity-100"
                />
              ) : null}
              <span className="relative flex min-w-0 items-center gap-2.5">
                {busy ? (
                  <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-accent-ink/25 border-t-accent-ink" />
                ) : (
                  <span
                    className={[
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      ready ? "bg-accent-ink/10" : "bg-white/[0.06]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "ml-0.5 h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent",
                        ready ? "border-l-accent-ink" : "border-l-fg-muted",
                      ].join(" ")}
                    />
                  </span>
                )}
                <span className="truncate text-[0.95rem] font-semibold tracking-tight">
                  {busy ? "Generating…" : "Generate"}
                </span>
              </span>
              {!busy ? (
                <span
                  className={[
                    "relative flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-medium tabular-nums",
                    ready
                      ? "bg-accent-ink/10 text-accent-ink/85"
                      : "bg-black/25 text-fg-subtle",
                  ].join(" ")}
                >
                  {duration != null && sellCredits != null ? (
                    <>
                      <span>{duration}s</span>
                      <span
                        className={
                          ready ? "text-accent-ink/40" : "text-fg-subtle/50"
                        }
                      >
                        ·
                      </span>
                      <span>{sellCredits.toLocaleString()} cr</span>
                    </>
                  ) : (
                    <span>
                      {usesGenjutsuPricing
                        ? `${genjutsuCreditsPerSecond(resolution).toLocaleString()} cr/s · ${resolution}`
                        : `${CREDITS_PER_SECOND} cr/s · ×${model.multiplier}`}
                    </span>
                  )}
                </span>
              ) : null}
            </button>
            <p
              className={[
                "mt-2 text-center text-[0.7rem] leading-tight",
                status === "need" || status === "error"
                  ? "text-accent"
                  : "text-fg-subtle",
              ].join(" ")}
            >
              {status === "need"
                ? isObjectSwap
                  ? "Add a reference image and source video first."
                  : "Add a character image and motion video first."
                : status === "generating"
                  ? isObjectSwap
                    ? "Uploading + swapping objects…"
                    : "Uploading + transferring motion…"
                  : status === "error"
                    ? errorMessage || "Generation failed."
                    : status === "done"
                      ? `Done · ${duration ?? "?"}s · ${modelMark}${usesGenjutsuPricing ? ` · ${resolution}` : ""}${lastPrompt ? (usingDefaultPrompt ? " · default prompt" : " · custom prompt") : ""}.`
                      : duration != null
                        ? usesGenjutsuPricing
                          ? `Credits follow video length · ${genjutsuCreditsPerSecond(resolution).toLocaleString()} cr/s · ${resolution}`
                          : `Credits follow motion length · ${CREDITS_PER_SECOND} cr/s ×${model.multiplier}`
                        : isObjectSwap
                          ? "Reference + video → object swap"
                          : "Character + motion → AI video"}
            </p>
          </div>
        </div>

        {/* Right: Preview / History (like tell AI Video Generator) */}
        <div className="relative flex min-h-0 flex-col p-3 sm:p-4">
          <StudioPreviewHistoryTabs
            mode={panelMode}
            onModeChange={setPanelMode}
            trailing={
              <>
                {duration != null ? `${duration}s · ` : ""}
                {usesGenjutsuPricing ? `${resolution} · ` : ""}
                {modelMark}
                {status === "error" &&
                errorMessage?.toLowerCase().includes("credit") ? (
                  <>
                    {" · "}
                    <Link href="/pricing" className="text-accent hover:underline">
                      Get credits
                    </Link>
                  </>
                ) : null}
              </>
            }
          />

          <div className="mt-3 flex min-h-0 flex-1 flex-col">
            {panelMode === "history" ? (
              <StudioHistoryPanel
                items={history}
                onSelect={openHistoryItem}
                onDownload={downloadHistoryItem}
              />
            ) : (
              <>
                <div
                  className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-white/[0.1] bg-[#0a0a0c]"
                  aria-busy={busy}
                >
                  {resultUrl && !busy ? (
                    <video
                      key={resultUrl}
                      src={resultUrl}
                      controls
                      autoPlay
                      playsInline
                      className="absolute inset-0 h-full w-full object-contain bg-black"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
                        <div className="relative h-full max-h-full w-auto max-w-full aspect-[9/16] overflow-hidden rounded-lg bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                          <video
                            key={DEMO_PREVIEW_VIDEO}
                            src={DEMO_PREVIEW_VIDEO}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 h-full w-full object-cover"
                            aria-label="Sample motion transfer preview"
                          />
                        </div>
                      </div>
                      {status === "error" ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/65 px-6 text-center backdrop-blur-[2px]">
                          <p className="text-sm font-medium text-fg">
                            Generation failed
                          </p>
                          <p className="text-[0.7rem] text-fg-subtle">
                            {errorMessage || "Try again"}
                          </p>
                        </div>
                      ) : null}
                    </>
                  )}

                  {busy ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0a0a0c]/85 px-6 backdrop-blur-[3px]">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
                      <p
                        className="font-mono text-4xl font-semibold tabular-nums tracking-tight text-fg sm:text-5xl"
                        aria-live="polite"
                      >
                        {formatElapsed(elapsedSec)}
                      </p>
                      <p className="text-sm font-medium text-fg">
                        Generating your video
                      </p>
                      <div
                        className="flex items-end gap-6"
                        aria-label="Expected wait in minutes"
                      >
                        {([1, 2, 3] as const).map((min) => {
                          const reached = elapsedSec >= min * 60;
                          const active =
                            !reached && elapsedSec >= (min - 1) * 60;
                          return (
                            <div
                              key={min}
                              className="flex flex-col items-center gap-1"
                            >
                              <span
                                className={[
                                  "font-mono text-2xl font-bold tabular-nums leading-none sm:text-3xl",
                                  reached
                                    ? "text-accent"
                                    : active
                                      ? "text-fg"
                                      : "text-fg-subtle/45",
                                ].join(" ")}
                              >
                                {min}
                              </span>
                              <span
                                className={[
                                  "text-[10px] font-medium uppercase tracking-wide",
                                  reached || active
                                    ? "text-fg-subtle"
                                    : "text-fg-subtle/45",
                                ].join(" ")}
                              >
                                min
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-center text-[11px] text-fg-subtle">
                        Keep this tab open
                      </p>
                    </div>
                  ) : null}

                  {imageUrl && !busy ? (
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

                {resultUrl && !busy ? (
                  <button
                    type="button"
                    onClick={downloadResult}
                    className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] text-sm font-medium text-fg transition hover:border-white/[0.2] hover:bg-white/[0.07]"
                  >
                    Download MP4
                  </button>
                ) : null}
              </>
            )}
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
