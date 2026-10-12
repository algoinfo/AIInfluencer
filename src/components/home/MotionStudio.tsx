"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { StudioHistoryPanel } from "@/components/studio/StudioHistoryPanel";
import {
  StudioPreviewHistoryTabs,
  type StudioPanelMode,
} from "@/components/studio/StudioPreviewHistoryTabs";
import {
  CREDITS_PER_SECOND,
  DEFAULT_MOTION_MODEL_MULTIPLIER,
  creditsForRun,
} from "@/data/credits";
import {
  FAL_MOTION_DEFAULT_RESOLUTION,
  FAL_MOTION_RESOLUTIONS,
  type FalMotionResolution,
} from "@/data/fal-motion-resolution";
import {
  creditsForGenjutsuRun,
  GENJUTSU_DEFAULT_RESOLUTION,
  GENJUTSU_MIN_DURATION_SEC,
  GENJUTSU_RESOLUTIONS,
  genjutsuCreditsPerSecond,
  type GenjutsuResolution,
} from "@/data/genjutsu-pricing";
import {
  creditsForPixverseSwapRun,
  PIXVERSE_SWAP_DEFAULT_MODE,
  PIXVERSE_SWAP_DEFAULT_RESOLUTION,
  PIXVERSE_SWAP_RESOLUTIONS,
  pixverseSwapCreditsPerSecond,
  type PixverseSwapResolution,
} from "@/data/pixverse-swap";
import { resolveMotionPrompt } from "@/data/motion-prompt";
import { probeVideoFileMeta } from "@/lib/probe-video-duration-client";
import {
  billableSecondsFromDuration,
  MOTION_TRANSFER_MAX_DURATION_SEC,
} from "@/lib/probe-video-duration";
import {
  clearStudioDraft,
  loadStudioDraft,
  saveStudioDraft,
} from "@/lib/studio-draft";
import { preferHistoryVideoUrl } from "@/lib/r2-url";
import {
  fetchCloudStudioHistory,
  loadStudioHistory,
  mergeCloudStudioHistory,
  deleteCloudStudioHistory,
  isBookkeepingHistoryError,
  persistCloudStudioHistory,
  prependStudioHistory,
  removeStudioHistoryItem,
  saveStudioHistory,
  updateStudioHistoryItem,
  type StudioHistoryItem,
} from "@/lib/studio-history";

function formatElapsedParts(totalSeconds: number): {
  mm: string;
  ss: string;
  label: string;
} {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  return {
    mm,
    ss,
    label: m > 0 ? `${m}m ${ss}s` : `${s}s`,
  };
}

type StudioMode = "object-swap" | "motion-transfer";

const MODE_TABS: { id: StudioMode; label: string }[] = [
  { id: "motion-transfer", label: "Motion transfer" },
  { id: "object-swap", label: "Objects swap" },
];

const OBJECT_SWAP_ETA = { etaLabel: "~2–5 min", typicalWaitSec: 180 };

/** Examples strip — click to fill Motion upload. */
const SAMPLE_MOTION_CLIPS = [
  { id: "1", src: "/1.mp4", poster: "/samples/1.png", label: "1" },
  { id: "2", src: "/2.mp4", poster: "/samples/2.png", label: "2" },
  { id: "3", src: "/3.mp4", poster: "/samples/3.png", label: "3" },
  { id: "4", src: "/4.mp4", poster: "/samples/4.png", label: "4" },
] as const;

/** Idle preview uses the first local sample so the panel is never empty. */
const DEMO_PREVIEW_VIDEO = SAMPLE_MOTION_CLIPS[0].src;
const DEMO_PREVIEW_POSTER = SAMPLE_MOTION_CLIPS[0].poster;

type StudioModel = {
  id: string;
  name: string;
  meta: string;
  mark: string;
  multiplier: number;
  provider: "higgsfield" | "fal";
  /** Typical wall-clock wait for a short clip (shown on Generate + busy UI). */
  etaLabel: string;
  typicalWaitSec: number;
  /** Temporarily unavailable — shown grayed out, not selectable. */
  disabled?: boolean;
};

const models: StudioModel[] = [
  {
    id: "kling-v3-pro",
    name: "Kling V3 Pro Motion Control",
    meta: `Pro · ×${DEFAULT_MOTION_MODEL_MULTIPLIER} credits`,
    mark: "K3",
    multiplier: DEFAULT_MOTION_MODEL_MULTIPLIER,
    provider: "fal",
    etaLabel: "~5–8 min",
    typicalWaitSec: 360,
  },
  {
    id: "genjutsu",
    name: "genjutsu",
    meta: "Higgsfield · by resolution",
    mark: "gj",
    multiplier: 1,
    provider: "higgsfield",
    etaLabel: "~5–8 min",
    typicalWaitSec: 360,
    disabled: true,
  },
  {
    id: "kling-v3-standard",
    name: "Kling V3 Standard Motion Control",
    meta: "Standard · ×1.2 credits",
    mark: "V3",
    multiplier: 1.2,
    provider: "fal",
    etaLabel: "~5–7 min",
    typicalWaitSec: 330,
  },
  {
    id: "kling-v26-standard",
    name: "Kling V2.6 Standard Motion Control",
    meta: "Standard · ×1.0 credits",
    mark: "2.6",
    multiplier: 1,
    provider: "fal",
    etaLabel: "~4–6 min",
    typicalWaitSec: 300,
  },
];

const DEFAULT_MOTION_MODEL =
  models.find((m) => m.id === "kling-v3-pro" && !m.disabled) ??
  models.find((m) => !m.disabled) ??
  models[0];

export function MotionStudio() {
  const { isLoggedIn, openAuthModal, refreshSession } = useAuth();
  const [studioMode, setStudioMode] = useState<StudioMode>("motion-transfer");
  const [resolution, setResolution] = useState<
    GenjutsuResolution | FalMotionResolution | PixverseSwapResolution
  >(FAL_MOTION_DEFAULT_RESOLUTION);
  const [model, setModel] = useState(() => DEFAULT_MOTION_MODEL);
  const [open, setOpen] = useState(false);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDurationSec, setVideoDurationSec] = useState<number | null>(null);
  const [videoFramePixels, setVideoFramePixels] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [promptOn, setPromptOn] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "need" | "generating" | "done" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultAspect, setResultAspect] = useState("9 / 16");
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<StudioPanelMode>("preview");
  const [history, setHistory] = useState<StudioHistoryItem[]>([]);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [lastElapsedSec, setLastElapsedSec] = useState<number | null>(null);
  const [previewMuted, setPreviewMuted] = useState(true);
  const [mobileGeneratePinned, setMobileGeneratePinned] = useState(true);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const studioRootRef = useRef<HTMLDivElement | null>(null);
  const toolsPanelRef = useRef<HTMLDivElement | null>(null);
  const elapsedRef = useRef(0);
  const generateLockRef = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const promptId = useId();
  const duration = videoDurationSec;
  const isObjectSwap = studioMode === "object-swap";
  const isGenjutsuMotion =
    !isObjectSwap && model.provider === "higgsfield";
  const usesGenjutsuPricing = isGenjutsuMotion;
  const usesPixversePricing = isObjectSwap;
  const motionResolutions = isObjectSwap
    ? PIXVERSE_SWAP_RESOLUTIONS
    : isGenjutsuMotion
      ? GENJUTSU_RESOLUTIONS
      : FAL_MOTION_RESOLUTIONS;
  const genjutsuResolution: GenjutsuResolution =
    resolution === "480p" || resolution === "720p" || resolution === "1080p"
      ? resolution
      : GENJUTSU_DEFAULT_RESOLUTION;
  const falResolution: FalMotionResolution =
    resolution === "480p" || resolution === "580p" || resolution === "720p"
      ? resolution
      : FAL_MOTION_DEFAULT_RESOLUTION;
  const pixverseResolution: PixverseSwapResolution =
    resolution === "360p" || resolution === "540p" || resolution === "720p"
      ? resolution
      : PIXVERSE_SWAP_DEFAULT_RESOLUTION;
  const sellCredits =
    duration == null
      ? null
      : usesPixversePricing
        ? creditsForPixverseSwapRun(duration, pixverseResolution)
        : usesGenjutsuPricing
          ? creditsForGenjutsuRun(duration, genjutsuResolution)
          : creditsForRun(duration, model.multiplier);
  const usingDefaultPrompt = !promptOn || prompt.trim().length === 0;
  const modelMark = isObjectSwap ? "pv" : model.mark;

  useEffect(() => {
    // Drop legacy false "Interrupted" rows written by an older persist bug.
    const local = loadStudioHistory();
    setHistory(local);
    saveStudioHistory(local);
  }, []);

  const refreshCloudHistory = useCallback(() => {
    if (!isLoggedIn) return;
    void fetchCloudStudioHistory(24).then((cloud) => {
      if (cloud == null) return;
      setHistory((prev) => mergeCloudStudioHistory(prev, cloud));
    });
  }, [isLoggedIn]);

  useEffect(() => {
    refreshCloudHistory();
  }, [refreshCloudHistory]);

  useEffect(() => {
    if (panelMode !== "history") return;
    refreshCloudHistory();
  }, [panelMode, refreshCloudHistory]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const tools = toolsPanelRef.current;
    if (!tools || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // Keep Generate pinned while any part of the tools panel is on screen;
        // hide once the user scrolls past it (into SEO/pricing below).
        setMobileGeneratePinned(entry.isIntersecting);
      },
      {
        threshold: [0, 0.01, 0.15],
        rootMargin: "0px 0px -8% 0px",
      },
    );
    io.observe(tools);
    return () => io.disconnect();
  }, []);

  const persistDraft = useCallback(async () => {
    await saveStudioDraft({
      studioMode,
      modelId: isObjectSwap ? "pixverse-swap" : model.id,
      resolution,
      prompt,
      promptOn,
      resumeGenerate: false,
      imageFiles: imageFile ? [imageFile] : [],
      videoFile,
    });
  }, [
    isObjectSwap,
    imageFile,
    studioMode,
    model.id,
    resolution,
    prompt,
    promptOn,
    videoFile,
  ]);

  const promptLoginForGenerate = useCallback(() => {
    void persistDraft();
    openAuthModal({
      mode: "login",
      reason: "generation",
      beforeOAuth: () => persistDraft(),
    });
  }, [openAuthModal, persistDraft]);

  // Restore selections after OAuth redirect (IndexedDB keeps File blobs).
  // Does not auto-start generation — user clicks Generate again.
  useEffect(() => {
    let cancelled = false;
    void loadStudioDraft()
      .then(async (draft) => {
        if (cancelled) return;
        if (!draft) return;

        setStudioMode(draft.studioMode);
        setResolution(
          draft.resolution === "360p" ||
            draft.resolution === "480p" ||
            draft.resolution === "540p" ||
            draft.resolution === "580p" ||
            draft.resolution === "720p" ||
            draft.resolution === "1080p"
            ? draft.resolution
            : GENJUTSU_DEFAULT_RESOLUTION,
        );
        setPrompt(draft.prompt);
        setPromptOn(draft.promptOn);
        const matched = models.find((item) => item.id === draft.modelId);
        setModel(
          matched && !matched.disabled ? matched : DEFAULT_MOTION_MODEL,
        );

        setVideoUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        setImageUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });

        {
          const primary = draft.imageFiles[0] ?? null;
          if (primary) {
            const url = URL.createObjectURL(primary);
            setImageFile(primary);
            setImageName(primary.name);
            setImageUrl(url);
          } else {
            setImageFile(null);
            setImageName(null);
          }
        }

        if (draft.videoFile) {
          const url = URL.createObjectURL(draft.videoFile);
          setVideoFile(draft.videoFile);
          setVideoName(draft.videoFile.name);
          setVideoUrl(url);
          setVideoDurationSec(null);
          setVideoFramePixels(null);
          void probeVideoFileMeta(draft.videoFile).then((meta) => {
            if (cancelled) return;
            const billable = billableSecondsFromDuration(
              meta?.durationSec ?? 0,
            );
            setVideoDurationSec(billable);
            setVideoFramePixels(meta?.framePixels ?? null);
          });
        } else {
          setVideoFile(null);
          setVideoName(null);
        }

        await clearStudioDraft();
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (resultUrl?.startsWith("blob:")) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revoke only on unmount / replace via setters
  }, []);

  useEffect(() => {
    if (status !== "generating") return;
    elapsedRef.current = 0;
    setElapsedSec(0);
    const startedAt = Date.now();
    const id = window.setInterval(() => {
      const next = Math.floor((Date.now() - startedAt) / 1000);
      elapsedRef.current = next;
      setElapsedSec(next);
    }, 200);
    return () => window.clearInterval(id);
  }, [status]);

  function syncPrimaryImage(file: File | null, preview: string | null) {
    if (imageUrl && imageUrl !== preview) URL.revokeObjectURL(imageUrl);
    setImageName(file?.name ?? null);
    setImageFile(file);
    setImageUrl(preview);
  }

  function clearImagePreview() {
    syncPrimaryImage(null, null);
    setStatus("idle");
    setErrorMessage(null);
  }

  function onImage(file: File | null) {
    if (!file) return;
    syncPrimaryImage(file, URL.createObjectURL(file));
    setStatus("idle");
    setErrorMessage(null);
  }

  function clearVideoPreview() {
    setVideoFile(null);
    setVideoName(null);
    setVideoDurationSec(null);
    setVideoFramePixels(null);
    setVideoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setStatus("idle");
    setErrorMessage(null);
  }

  function onVideo(file: File | null) {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setVideoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return preview;
    });
    setVideoName(file.name);
    setVideoFile(file);
    setVideoDurationSec(null);
    setVideoFramePixels(null);
    setResultUrl(null);
    setResultAspect("9 / 16");
    setStatus("idle");
    setErrorMessage(null);

    void probeVideoFileMeta(file).then((meta) => {
      const raw = meta?.durationSec ?? null;
      if (raw != null && raw > MOTION_TRANSFER_MAX_DURATION_SEC + 0.05) {
        clearVideoPreview();
        setStatus("error");
        setErrorMessage(
          `Motion video is too long (max ${MOTION_TRANSFER_MAX_DURATION_SEC}s).`,
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

  async function applySampleMotion(src: string, fileName: string) {
    if (busy) return;
    setPanelMode("preview");
    setStatus("idle");
    setErrorMessage(null);
    setResultUrl(null);
    setResultAspect("9 / 16");
    setLastElapsedSec(null);
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error("Could not load sample motion.");
      const blob = await res.blob();
      const file = new File([blob], fileName, {
        type: blob.type || "video/mp4",
      });
      onVideo(file);
    } catch {
      setStatus("error");
      setErrorMessage("Could not load that sample motion. Try again.");
    }
  }

  async function onGenerate() {
    // Sync lock so a second click can't fire before React re-renders disabled.
    if (generateLockRef.current || status === "generating") return;

    if (!isLoggedIn) {
      promptLoginForGenerate();
      return;
    }
    const primaryImage = imageFile;
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

    generateLockRef.current = true;
    setErrorMessage(null);
    setLastElapsedSec(null);
    setStatus("generating");
    setPanelMode("history");

    const cost =
      sellCredits ??
      (usesPixversePricing
        ? creditsForPixverseSwapRun(duration, pixverseResolution)
        : usesGenjutsuPricing
          ? creditsForGenjutsuRun(duration, genjutsuResolution)
          : creditsForRun(duration, model.multiplier));

    try {
      // Balance check after UI is already locked; fail soft back to error.
      try {
        const creditsRes = await fetch("/api/user/credits", {
          credentials: "include",
        });
        if (creditsRes.ok) {
          const creditsData = (await creditsRes.json()) as { credits?: number };
          const available = Number(creditsData.credits ?? 0);
          if (available < cost) {
            setStatus("error");
            setErrorMessage(
              `Not enough credits. This video needs ${cost.toLocaleString("en-US")} credits — you have ${available.toLocaleString("en-US")}.`,
            );
            setPanelMode("preview");
            return;
          }
        }
      } catch {
        /* server still enforces balance */
      }

      const resolved = usesGenjutsuPricing || usesPixversePricing
        ? promptOn
          ? prompt.trim()
          : ""
        : resolveMotionPrompt(promptOn ? prompt : "");
      setLastPrompt(resolved || null);

      if (resultUrl?.startsWith("blob:")) URL.revokeObjectURL(resultUrl);
      setResultUrl(null);

      const historyId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const outResolution = usesPixversePricing
        ? pixverseResolution
        : usesGenjutsuPricing
          ? genjutsuResolution
          : falResolution;
      const pendingItem: StudioHistoryItem = {
        id: historyId,
        title:
          primaryImage.name.replace(/\.[^.]+$/, "") ||
          (isObjectSwap ? "PixVerse Swap" : "Motion transfer"),
        createdAt: new Date().toISOString(),
        videoUrl: "",
        durationSec: duration,
        modelMark: modelMark,
        status: "generating",
        resolution: outResolution,
      };
      setHistory((prev) => prependStudioHistory(prev, pendingItem));

      try {
        const form = new FormData();
        form.set("mode", studioMode);
        form.set("modelId", isObjectSwap ? "pixverse-swap" : model.id);
        form.set("modelMark", modelMark);
        form.set("clientJobId", historyId);
        form.set("characterImage", primaryImage);
        form.set("motionVideo", videoFile);
        form.set("prompt", resolved);
        form.set("durationSec", String(duration));
        form.set("modelMultiplier", String(model.multiplier));
        form.set("resolution", outResolution);
        if (isObjectSwap) form.set("swapMode", PIXVERSE_SWAP_DEFAULT_MODE);
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
            setHistory((prev) =>
              updateStudioHistoryItem(prev, historyId, {
                status: "failed",
                errorMessage: "Sign in required.",
                elapsedSec: elapsedRef.current,
              }),
            );
            setStatus("idle");
            promptLoginForGenerate();
            return;
          }
          if (res.status === 402 && data?.needsCredits) {
            const message =
              data.error ||
              "Not enough credits. Buy a pack on Pricing to continue.";
            setHistory((prev) =>
              updateStudioHistoryItem(prev, historyId, {
                status: "failed",
                errorMessage: message,
                elapsedSec: elapsedRef.current,
              }),
            );
            setStatus("error");
            setErrorMessage(message);
            return;
          }
          throw new Error(data?.error || "Generation failed.");
        }

        const data = (await res.json()) as {
          videoUrl?: string;
          r2Url?: string | null;
          r2Key?: string | null;
          jobId?: string | null;
        };
        const sourceUrl = data.videoUrl?.trim() || "";
        // Preview can use fal CDN; history must prefer R2 (public or /api/media/r2).
        const historyUrl = preferHistoryVideoUrl({
          r2Url: data.r2Url,
          r2Key: data.r2Key,
          fallbackUrl: sourceUrl,
        });
        let cloudId = data.jobId?.trim() || historyId;
        if (!sourceUrl) {
          throw new Error("Generation returned no video URL.");
        }

        if (resultUrl?.startsWith("blob:")) URL.revokeObjectURL(resultUrl);
        // Play the provider CDN URL immediately — history uses R2 separately.
        setResultUrl(sourceUrl);
        setLastElapsedSec(elapsedRef.current);
        setStatus("done");
        setPanelMode("preview");
        void clearStudioDraft();

        // Always sync finished work into Turso (server + client fallback).
        const saved = await persistCloudStudioHistory({
          id: cloudId,
          title: pendingItem.title,
          videoUrl: historyUrl,
          r2Key: data.r2Key ?? null,
          durationSec: duration,
          modelMark: modelMark,
          resolution: outResolution,
          product: studioMode,
          status: "done",
        });
        if (saved?.id) cloudId = saved.id;

        setHistory((prev) => {
          const withoutLocal = prev.filter((item) => item.id !== historyId);
          return prependStudioHistory(withoutLocal, {
            id: cloudId,
            title: pendingItem.title,
            createdAt: pendingItem.createdAt,
            videoUrl: historyUrl,
            durationSec: duration,
            modelMark: modelMark,
            status: "done",
            resolution: outResolution,
            elapsedSec: elapsedRef.current,
          });
        });
        void refreshSession();
        refreshCloudHistory();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Generation failed.";
        setLastElapsedSec(elapsedRef.current);
        // Video may already exist in Turso; don't overwrite completed with a
        // bookkeeping error, and don't keep a false Failed row locally.
        if (isBookkeepingHistoryError(message)) {
          setHistory((prev) => prev.filter((item) => item.id !== historyId));
          setStatus("idle");
          setErrorMessage(null);
          refreshCloudHistory();
          return;
        }
        setHistory((prev) =>
          updateStudioHistoryItem(prev, historyId, {
            status: "failed",
            errorMessage: message,
            elapsedSec: elapsedRef.current,
          }),
        );
        setStatus("error");
        setErrorMessage(message);
        void persistCloudStudioHistory({
          id: historyId,
          title: pendingItem.title,
          durationSec: duration,
          modelMark: modelMark,
          resolution: outResolution,
          product: studioMode,
          status: "failed",
          errorMessage: message,
        }).then(() => refreshCloudHistory());
      }
    } finally {
      generateLockRef.current = false;
    }
  }

  const downloadResult = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "genjutsu-motion.mp4";
    a.rel = "noopener";
    a.target = "_blank";
    a.click();
  }, [resultUrl]);

  function clearResultPreview() {
    setResultUrl(null);
    setResultAspect("9 / 16");
    setLastElapsedSec(null);
    setLastPrompt(null);
    if (status === "done" || status === "error") {
      setStatus("idle");
      setErrorMessage(null);
    }
  }

  const openHistoryItem = useCallback((item: StudioHistoryItem) => {
    if (item.status !== "done" || !item.videoUrl) return;
    setResultAspect("9 / 16");
    setResultUrl(item.videoUrl);
    setStatus("done");
    setPanelMode("preview");
  }, []);

  const downloadHistoryItem = useCallback((item: StudioHistoryItem) => {
    if (item.status !== "done" || !item.videoUrl) return;
    const a = document.createElement("a");
    a.href = item.videoUrl;
    a.download = `genjutsu-${item.id}.mp4`;
    a.click();
  }, []);

  const deleteHistoryItem = useCallback(
    (item: StudioHistoryItem) => {
      if (item.status === "generating") return;
      setHistory((prev) => removeStudioHistoryItem(prev, item.id));
      if (resultUrl && item.videoUrl && resultUrl === item.videoUrl) {
        setResultUrl(null);
        setStatus("idle");
      }
      if (isLoggedIn) {
        void deleteCloudStudioHistory(item.id);
      }
    },
    [isLoggedIn, resultUrl],
  );

  const ready = Boolean(imageFile && videoFile && duration != null);
  const busy = status === "generating";
  const elapsedParts = formatElapsedParts(elapsedSec);
  const eta = isObjectSwap
    ? OBJECT_SWAP_ETA
    : { etaLabel: model.etaLabel, typicalWaitSec: model.typicalWaitSec };
  const typicalWaitSec = eta.typicalWaitSec;
  const progressPct = Math.min(96, (elapsedSec / typicalWaitSec) * 100);
  const phaseHint =
    elapsedSec < 15
      ? "Uploading assets…"
      : elapsedSec < Math.min(45, typicalWaitSec * 0.3)
        ? "Starting the model…"
        : elapsedSec < typicalWaitSec * 0.85
          ? "Rendering frames…"
          : "Almost there…";

  return (
    <div
      id="studio"
      ref={studioRootRef}
      className="animate-rise-delay-1 relative flex w-full flex-col overflow-hidden rounded-[1.05rem] border border-white/[0.12] bg-[linear-gradient(180deg,rgba(22,22,28,0.72),rgba(8,8,12,0.82))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl sm:rounded-[1.2rem] lg:h-full lg:min-h-0"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(216,255,62,0.06),transparent_45%),radial-gradient(ellipse_at_90%_20%,rgba(255,255,255,0.04),transparent_40%)]" />

      <div className="relative flex flex-col lg:min-h-0 lg:flex-1 lg:grid lg:grid-cols-[440px_1fr] xl:grid-cols-[460px_1fr]">
        {/* Tools — below preview on mobile */}
        <div
          ref={toolsPanelRef}
          className="order-2 flex flex-col border-t border-white/[0.07] pb-[calc(4.75rem+env(safe-area-inset-bottom))] lg:order-1 lg:min-h-0 lg:border-t-0 lg:border-r lg:border-white/[0.07] lg:pb-0"
        >
          <div className="flex flex-col gap-3 p-3 sm:p-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:[scrollbar-width:thin]">
            {/* Mode tabs — segmented control */}
            <div
              className="flex shrink-0 gap-0.5 rounded-xl bg-[#121214] p-1 ring-1 ring-inset ring-white/[0.06]"
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
                        setModel(DEFAULT_MOTION_MODEL);
                        if (
                          resolution === "360p" ||
                          resolution === "540p" ||
                          resolution === "1080p"
                        ) {
                          setResolution(FAL_MOTION_DEFAULT_RESOLUTION);
                        }
                      } else {
                        setResolution(PIXVERSE_SWAP_DEFAULT_RESOLUTION);
                      }
                    }}
                    className={[
                      "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[0.78rem] font-medium tracking-tight transition sm:gap-2 sm:px-2.5 sm:text-[0.82rem]",
                      active
                        ? "bg-[#2a2a2e] text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                        : "text-fg-subtle hover:text-fg-muted",
                    ].join(" ")}
                  >
                    <ModeTabIcon mode={tab.id} active={active} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Object Swap → fal-ai/pixverse/swap */}
            {isObjectSwap ? (
              <div className="shrink-0">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-[0.78rem] font-medium tracking-wide text-fg-muted">
                    Resolution
                  </p>
                  <p className="text-[0.75rem] font-medium tabular-nums text-fg-muted">
                    {pixverseSwapCreditsPerSecond(
                      pixverseResolution,
                    ).toLocaleString()}{" "}
                    credits/s
                  </p>
                </div>
                <div className="flex gap-0.5 rounded-xl bg-[#121214] p-1 ring-1 ring-inset ring-white/[0.06]">
                  {PIXVERSE_SWAP_RESOLUTIONS.map((option) => {
                    const active = option === resolution;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setResolution(option)}
                        className={[
                          "min-w-0 flex-1 rounded-lg px-1 py-2 text-center text-[0.82rem] font-medium tracking-tight transition",
                          active
                            ? "bg-[#2a2a2e] text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                            : "text-fg-subtle hover:text-fg-muted",
                        ].join(" ")}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2.5">
                  <p className="mb-1.5 text-[0.78rem] font-medium tracking-wide text-fg-muted">
                    Swap
                  </p>
                  <div className="rounded-xl border border-white/[0.12] bg-white/[0.05] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
                    <div className="rounded-lg bg-accent px-2 py-2 text-center text-sm font-medium capitalize text-[#0a0a0c]">
                      Object
                    </div>
                  </div>
                  <p className="mt-2 text-[0.8rem] leading-snug text-fg-muted">
                    Replaces the object in the source video with your swap image.
                  </p>
                </div>
              </div>
            ) : (
              <div className="shrink-0 space-y-2.5">
                <div
                  ref={menuRef}
                  className={open ? "relative z-50" : "relative z-0"}
                >
                  <p className="mb-1.5 text-[0.78rem] font-medium tracking-wide text-fg-muted">
                    Model
                  </p>
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={listId}
                    onClick={() => setOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/[0.14] bg-[#1a1a1e] px-3 py-2.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:border-white/[0.22] hover:bg-[#222228]"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-accent px-1.5 font-display text-[0.6rem] font-semibold leading-none text-[#0a0a0c]">
                        {model.mark}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[0.9rem] font-medium text-fg">
                          {model.name}
                        </span>
                        <span className="mt-0.5 block text-[0.78rem] font-medium text-fg-muted">
                          {isGenjutsuMotion
                            ? `${genjutsuCreditsPerSecond(genjutsuResolution).toLocaleString()} credits/s · ${resolution} · ${model.etaLabel}`
                            : `${model.meta} · ${resolution} · ${model.etaLabel}`}
                        </span>
                      </span>
                    </span>
                    <Chevron open={open} />
                  </button>

                  {open ? (
                    <ul
                      id={listId}
                      role="listbox"
                      className="absolute left-0 right-0 z-50 mt-1.5 max-h-[min(46vh,280px)] overflow-y-auto overscroll-contain rounded-2xl border border-white/[0.12] bg-[#141416] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] [scrollbar-width:thin]"
                    >
                      {models.map((item) => {
                        const disabled = Boolean(item.disabled);
                        const itemCredits =
                          item.provider === "higgsfield"
                            ? duration != null
                              ? creditsForGenjutsuRun(
                                  duration,
                                  genjutsuResolution,
                                )
                              : genjutsuCreditsPerSecond(genjutsuResolution)
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
                              aria-disabled={disabled}
                              disabled={disabled}
                              onClick={() => {
                                if (disabled) return;
                                setModel(item);
                                setOpen(false);
                                // Clamp resolution to the selected provider's options.
                                if (item.provider === "fal") {
                                  setResolution((prev) =>
                                    prev === "480p" ||
                                    prev === "580p" ||
                                    prev === "720p"
                                      ? prev
                                      : FAL_MOTION_DEFAULT_RESOLUTION,
                                  );
                                } else {
                                  setResolution((prev) =>
                                    prev === "480p" ||
                                    prev === "720p" ||
                                    prev === "1080p"
                                      ? prev
                                      : GENJUTSU_DEFAULT_RESOLUTION,
                                  );
                                }
                              }}
                              className={[
                                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                                disabled
                                  ? "cursor-not-allowed opacity-40"
                                  : item.id === model.id
                                    ? "bg-white/[0.08]"
                                    : "hover:bg-white/[0.04]",
                              ].join(" ")}
                            >
                              <span
                                className={[
                                  "flex h-8 min-w-8 items-center justify-center rounded-lg px-1 font-display text-[0.6rem] font-semibold leading-none",
                                  disabled
                                    ? "bg-white/15 text-fg-muted"
                                    : "bg-accent/90 text-[#0a0a0c]",
                                ].join(" ")}
                              >
                                {item.mark}
                              </span>
                              <span className="min-w-0">
                                <span
                                  className={[
                                    "block truncate text-[0.9rem] font-medium",
                                    disabled ? "text-fg-muted" : "text-fg",
                                  ].join(" ")}
                                >
                                  {item.name}
                                  {disabled ? " · soon" : ""}
                                </span>
                                <span className="mt-0.5 block text-[0.78rem] font-medium text-fg-muted">
                                  {item.meta}
                                  {duration != null
                                    ? ` · ${itemCredits.toLocaleString()} credits / ${duration}s`
                                    : ` · ${itemCredits.toLocaleString()} credits/s`}
                                  {` · ${item.etaLabel}`}
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>

                <div>
                  <p className="mb-1.5 text-[0.78rem] font-medium tracking-wide text-fg-muted">
                    Resolution
                  </p>
                  <div className="flex gap-0.5 rounded-xl bg-[#121214] p-1 ring-1 ring-inset ring-white/[0.06]">
                    {motionResolutions.map((option) => {
                      const active = option === resolution;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setResolution(option)}
                          className={[
                            "min-w-0 flex-1 rounded-lg px-1 py-2 text-center text-[0.82rem] font-medium tracking-tight transition",
                            active
                              ? "bg-[#2a2a2e] text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                              : "text-fg-subtle hover:text-fg-muted",
                          ].join(" ")}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="grid shrink-0 grid-cols-2 gap-2.5">
              <UploadField
                label={isObjectSwap ? "Swap image" : "Character"}
                required
                hint="JPG / PNG"
                button="Add image"
                accept="image/*"
                fileName={imageName}
                previewUrl={imageUrl}
                previewKind="image"
                onPick={onImage}
                onClear={clearImagePreview}
                icon="image"
                compact
              />
              <UploadField
                label={isObjectSwap ? "Source video" : "Motion"}
                required
                hint={
                  duration != null ? `${duration}s · billable` : "MP4 / MOV"
                }
                button="Add video"
                accept="video/*"
                fileName={videoName}
                previewUrl={videoUrl}
                previewKind="video"
                onPick={onVideo}
                onClear={clearVideoPreview}
                icon="video"
                compact
              />
            </div>

            {/* Prompt — toggle like Genjutsu studio */}
            <div className="shrink-0">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor={promptId}
                  className="flex items-center gap-2 text-[0.78rem] font-medium tracking-wide text-fg-muted"
                >
                  Prompt
                  <span className="normal-case tracking-normal text-fg-muted/90">
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
                  rows={2}
                  placeholder={
                    isObjectSwap
                      ? "e.g. Replace the bottle with this product, keep the hand and scene the same…"
                      : usesGenjutsuPricing
                        ? "e.g. Keep her face and hairstyle, casual streetwear, sunny outdoor…"
                        : "e.g. Same person as the photo, red jacket, city street at night, keep face unchanged…"
                  }
                  className="w-full resize-none rounded-xl border border-white/[0.14] bg-white/[0.06] px-3 py-2.5 text-[0.875rem] leading-relaxed text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none backdrop-blur-md transition placeholder:text-fg-muted/70 focus:border-accent/40 focus:bg-white/[0.1]"
                />
              ) : null}
            </div>
          </div>

          {/* Generate — fixed bottom on mobile while tools visible; inline on desktop */}
          <div
            className={[
              "border-t border-white/[0.1] backdrop-blur-xl transition-[transform,opacity] duration-200 ease-out",
              "fixed inset-x-0 bottom-0 z-50 bg-[#0a0a0c]/96 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
              mobileGeneratePinned
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-[110%] opacity-0",
              "lg:pointer-events-auto lg:static lg:inset-auto lg:z-auto lg:translate-y-0 lg:bg-white/[0.04] lg:p-3.5 lg:pb-3.5 lg:opacity-100",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={() => void onGenerate()}
              disabled={busy}
              aria-busy={busy}
              className={[
                "group relative flex h-12 w-full items-center justify-between gap-2 overflow-hidden rounded-2xl px-3.5 text-left transition-all duration-200 disabled:pointer-events-none disabled:cursor-wait sm:gap-3 sm:px-4",
                ready && !busy
                  ? "bg-accent text-accent-ink shadow-[0_8px_28px_rgba(216,255,62,0.18)] hover:bg-accent-strong hover:shadow-[0_10px_32px_rgba(216,255,62,0.28)] active:scale-[0.985]"
                  : busy
                    ? "bg-accent/80 text-accent-ink opacity-80 shadow-none"
                    : "bg-white/[0.08] text-fg ring-1 ring-inset ring-white/[0.1] hover:bg-white/[0.12]",
              ].join(" ")}
            >
              {ready ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition duration-500 group-hover:translate-x-[220%] group-hover:opacity-100 sm:block"
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
              {busy ? (
                <span
                  className="relative flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent-ink/10 px-2.5 py-1 text-[0.7rem] font-semibold tabular-nums text-accent-ink"
                  aria-live="polite"
                >
                  <span className="font-mono text-[0.8rem]">
                    {elapsedParts.mm}
                    <span className="animate-pulse opacity-70">:</span>
                    {elapsedParts.ss}
                  </span>
                  <span className="opacity-45">/</span>
                  <span>{eta.etaLabel}</span>
                </span>
              ) : (
                <span
                  className={[
                    "relative flex shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-medium tabular-nums",
                    ready
                      ? "bg-accent-ink/10 text-accent-ink/85"
                      : "bg-black/25 text-fg-muted",
                  ].join(" ")}
                >
                  {duration != null && sellCredits != null ? (
                    <>
                      <span>{duration}s</span>
                      <span
                        className={
                          ready ? "text-accent-ink/40" : "text-fg-muted/60"
                        }
                      >
                        ·
                      </span>
                      <span>{sellCredits.toLocaleString()} credits</span>
                      <span
                        className={`max-sm:hidden ${
                          ready ? "text-accent-ink/40" : "text-fg-muted/60"
                        }`}
                      >
                        ·
                      </span>
                      <span className="max-sm:hidden">{eta.etaLabel}</span>
                    </>
                  ) : (
                    <span>
                      {usesPixversePricing
                        ? `${pixverseSwapCreditsPerSecond(pixverseResolution).toLocaleString()} credits/s`
                        : usesGenjutsuPricing
                          ? `${genjutsuCreditsPerSecond(genjutsuResolution).toLocaleString()} credits/s`
                          : `${CREDITS_PER_SECOND} credits/s`}
                      <span className="max-sm:hidden">
                        {" "}
                        · {eta.etaLabel}
                      </span>
                    </span>
                  )}
                </span>
              )}
            </button>
            <p className="mt-2 hidden text-center text-[0.8rem] leading-snug text-fg-muted sm:block">
              {isObjectSwap
                ? "Tip: use a clear object image that matches size and angle of the item in the source video."
                : "Tip: keep the person a similar size and framing in the photo and the motion video."}
            </p>
            {status === "need" ||
            status === "error" ||
            status === "generating" ? (
              <p
                className={[
                  "mt-1.5 text-center text-[0.8rem] leading-tight",
                  status === "need" || status === "error"
                    ? "text-accent"
                    : "text-fg-muted",
                ].join(" ")}
              >
                {status === "need"
                  ? isObjectSwap
                    ? "Add a swap image and source video first."
                    : "Add a character image and motion video first."
                  : status === "generating"
                    ? `${phaseHint} · ${elapsedParts.label} / ${eta.etaLabel}`
                    : errorMessage || "Generation failed."}
              </p>
            ) : null}
          </div>
        </div>

        {/* Preview — first on mobile */}
        <div className="relative order-1 flex h-[min(52vh,420px)] flex-col p-2.5 sm:p-3 lg:order-2 lg:h-auto lg:min-h-0 lg:flex-1">
          <StudioPreviewHistoryTabs
            mode={panelMode}
            onModeChange={setPanelMode}
            historyCount={history.length}
            historyBusy={history.some((item) => item.status === "generating")}
          />

          <div className="mt-2 flex min-h-0 flex-1 flex-col">
            {panelMode === "history" ? (
              <StudioHistoryPanel
                items={history}
                onSelect={openHistoryItem}
                onDownload={downloadHistoryItem}
                onDelete={deleteHistoryItem}
                activeElapsedSec={elapsedSec}
              />
            ) : (
              <>
                <div className="flex min-h-0 flex-1 gap-2 sm:gap-2.5">
                  {/* Left: samples */}
                  <div className="flex w-[42%] max-w-[12.5rem] shrink-0 flex-col gap-1.5 sm:max-w-[14rem] sm:gap-2 lg:w-[38%] lg:max-w-[15rem]">
                    <p className="truncate text-[0.6rem] font-medium tracking-wide text-fg-subtle sm:text-[0.65rem]">
                      Examples
                    </p>
                    <div
                      className="grid min-h-0 flex-1 grid-rows-4 gap-1.5 sm:gap-2"
                      aria-label="Sample motion clips"
                    >
                      {SAMPLE_MOTION_CLIPS.map((clip) => {
                        const selected =
                          videoName === `${clip.id}.mp4` ||
                          videoName === clip.src;
                        return (
                          <button
                            key={clip.id}
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              void applySampleMotion(
                                clip.src,
                                `${clip.id}.mp4`,
                              )
                            }
                            className={[
                              "relative min-h-0 w-full overflow-hidden rounded-lg border bg-black/40 transition sm:rounded-xl",
                              selected
                                ? "border-accent/70 ring-1 ring-accent/40"
                                : "border-white/[0.14] hover:border-white/35",
                              busy
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer",
                            ].join(" ")}
                            aria-label={`Use sample ${clip.label} as motion video`}
                            aria-pressed={selected}
                            title={`Use as motion · ${clip.label}`}
                          >
                            <SampleThumb
                              src={clip.src}
                              poster={clip.poster}
                              playing={selected}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: preview */}
                  <div
                    className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-white/[0.12] bg-black/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
                    aria-busy={busy}
                  >
                    {resultUrl && !busy ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black p-2 sm:p-3">
                        <div
                          className="relative h-full max-h-full w-auto max-w-full overflow-hidden rounded-lg bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                          style={{ aspectRatio: resultAspect }}
                        >
                          <video
                            key={resultUrl}
                            ref={previewVideoRef}
                            src={resultUrl}
                            controls
                            autoPlay
                            playsInline
                            muted={previewMuted}
                            className="h-full w-full object-contain"
                            onLoadedMetadata={(e) => {
                              const el = e.currentTarget;
                              if (el.videoWidth > 0 && el.videoHeight > 0) {
                                setResultAspect(
                                  `${el.videoWidth} / ${el.videoHeight}`,
                                );
                              }
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
                          <div className="relative h-full max-h-full w-auto max-w-full aspect-[9/16] overflow-hidden rounded-lg bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                            {(() => {
                              const previewSrc = videoUrl || DEMO_PREVIEW_VIDEO;
                              const sample = SAMPLE_MOTION_CLIPS.find(
                                (c) =>
                                  videoName === `${c.id}.mp4` ||
                                  videoName === c.src ||
                                  (!videoUrl && c.src === DEMO_PREVIEW_VIDEO),
                              );
                              const poster =
                                sample?.poster ?? DEMO_PREVIEW_POSTER;
                              return (
                                <>
                                  <img
                                    src={poster}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover"
                                    draggable={false}
                                  />
                                  <video
                                    key={previewSrc}
                                    ref={previewVideoRef}
                                    src={previewSrc}
                                    poster={poster}
                                    autoPlay
                                    muted={previewMuted}
                                    loop
                                    playsInline
                                    preload="auto"
                                    className="absolute inset-0 h-full w-full object-cover"
                                    aria-label={
                                      videoUrl
                                        ? "Selected motion video preview"
                                        : "Sample motion transfer preview"
                                    }
                                  />
                                </>
                              );
                            })()}
                          </div>
                        </div>
                        {status === "error" ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/65 px-4 text-center backdrop-blur-[2px]">
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

                    {!busy ? (
                      <button
                        type="button"
                        onClick={() => {
                          const next = !previewMuted;
                          setPreviewMuted(next);
                          const el = previewVideoRef.current;
                          if (el) {
                            el.muted = next;
                            if (!next) {
                              void el.play().catch(() => {
                                /* autoplay with sound may still fail */
                              });
                            }
                          }
                        }}
                        className="absolute bottom-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/65 text-fg shadow-sm backdrop-blur-md transition hover:border-white/30 hover:bg-black/80 sm:bottom-3 sm:right-3 sm:h-9 sm:w-9"
                        aria-label={
                          previewMuted ? "Unmute preview" : "Mute preview"
                        }
                        aria-pressed={!previewMuted}
                        title={previewMuted ? "Sound on" : "Sound off"}
                      >
                        {previewMuted ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M2.5 6.2v3.6h2.2L8 13V3L4.7 6.2H2.5Z"
                              fill="currentColor"
                            />
                            <path
                              d="M10.2 5.8l3.5 3.5M13.7 5.8l-3.5 3.5"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M2.5 6.2v3.6h2.2L8 13V3L4.7 6.2H2.5Z"
                              fill="currentColor"
                            />
                            <path
                              d="M10 6.2c.7.6 1.1 1.4 1.1 2.3S10.7 10.2 10 10.8M11.8 4.6c1.3 1.1 2 2.5 2 4s-.7 2.9-2 4"
                              stroke="currentColor"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </button>
                    ) : null}

                    {busy ? (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a0c]/88 px-4 backdrop-blur-[4px]">
                        <div className="relative mb-4 flex h-14 w-14 items-center justify-center">
                          <div
                            className="absolute inset-0 rounded-full border border-white/[0.08]"
                            aria-hidden
                          />
                          <div
                            className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent"
                            style={{ animationDuration: "1.1s" }}
                            aria-hidden
                          />
                          <span className="font-mono text-[0.65rem] font-medium tabular-nums text-fg-subtle">
                            {Math.round(progressPct)}%
                          </span>
                        </div>
                        <p
                          className="flex items-baseline gap-1 font-mono text-3xl font-semibold leading-none tracking-tight text-fg sm:text-4xl"
                          aria-live="polite"
                          aria-label={`Elapsed ${elapsedParts.label}`}
                        >
                          <span className="tabular-nums">{elapsedParts.mm}</span>
                          <span className="animate-pulse text-accent">:</span>
                          <span className="tabular-nums">{elapsedParts.ss}</span>
                        </p>
                        <p className="mt-2 text-sm font-medium text-fg">
                          {phaseHint}
                        </p>
                        <p className="mt-1 text-[0.7rem] text-fg-subtle">
                          {modelMark} · usually {eta.etaLabel}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                {resultUrl && !busy ? (
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={downloadResult}
                      className="inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] text-sm font-medium text-fg transition hover:border-white/[0.2] hover:bg-white/[0.07]"
                    >
                      Download MP4
                    </button>
                    <button
                      type="button"
                      onClick={clearResultPreview}
                      className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] px-4 text-sm font-medium text-fg-muted transition hover:border-white/[0.2] hover:bg-white/[0.07] hover:text-fg"
                      aria-label="Clear preview result"
                    >
                      Clear
                    </button>
                    {lastElapsedSec != null ? (
                      <span className="shrink-0 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-2 font-mono text-[0.7rem] font-medium tabular-nums text-fg-subtle">
                        {formatElapsedParts(lastElapsedSec).label}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaPreview({
  url,
  kind,
}: {
  url: string;
  kind: "image" | "video";
}) {
  if (kind === "video") {
    return (
      <video
        src={url}
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          // Seek slightly in so the thumbnail isn't a black first frame.
          try {
            if (el.duration > 0.1) el.currentTime = 0.08;
          } catch {
            /* ignore */
          }
        }}
      />
    );
  }
  return (
    <Image src={url} alt="" fill unoptimized className="object-cover" />
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
  previewKind = "image",
  onPick,
  onClear,
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
  previewKind?: "image" | "video";
  onPick: (file: File | null) => void;
  onClear?: () => void;
  icon: "image" | "video";
  compact?: boolean;
}) {
  const filled = Boolean(fileName);

  const clearButton =
    filled && onClear ? (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }}
        className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-black/70 text-fg shadow-sm backdrop-blur-sm transition hover:border-white/30 hover:bg-black/85 hover:text-white"
        aria-label={`Remove ${label}`}
        title="Remove"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M2 2l6 6M8 2L2 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    ) : null;

  if (compact) {
    return (
      <div
        className={[
          "group relative flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition-all",
          filled
            ? "border-accent/25 bg-[rgba(216,255,62,0.04)]"
            : "border-dashed border-white/[0.12] bg-white/[0.025] hover:border-white/[0.22] hover:bg-white/[0.045]",
        ].join(" ")}
      >
        {clearButton}
        <label className="flex w-full cursor-pointer flex-col items-center gap-2">
          <div
            className={[
              "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border",
              filled
                ? "border-accent/30 bg-black/30"
                : "border-white/10 bg-black/25 text-fg-muted group-hover:text-fg",
            ].join(" ")}
          >
            {previewUrl ? (
              <MediaPreview url={previewUrl} kind={previewKind} />
            ) : (
              <UploadIcon type={icon} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[0.75rem] font-medium tracking-wide text-fg-muted">
              {label}
              {required ? (
                <span className="ml-0.5 text-[#ff5c5c]">*</span>
              ) : null}
            </p>
            <p className="mt-0.5 truncate text-[0.85rem] font-medium text-fg">
              {fileName ? "Ready" : button}
            </p>
            <p className="truncate text-[0.72rem] font-medium text-fg-muted">
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
      </div>
    );
  }

  return (
    <div
      className={[
        "group relative block shrink-0 rounded-lg border px-2.5 py-2 transition-all",
        filled
          ? "border-accent/25 bg-[rgba(216,255,62,0.04)]"
          : "border-dashed border-white/[0.12] bg-white/[0.025] hover:border-white/[0.22] hover:bg-white/[0.045]",
      ].join(" ")}
    >
      {clearButton}
      <label className="block cursor-pointer">
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
              <MediaPreview url={previewUrl} kind={previewKind} />
            ) : (
              <UploadIcon type={icon} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-fg-muted">
              {label}
              {required ? (
                <span className="ml-1 text-[#ff5c5c]">*</span>
              ) : null}
            </p>
            <p className="truncate text-[0.8rem] font-medium text-fg">
              {fileName || button}
            </p>
            <p className="truncate text-[0.68rem] font-medium text-fg-muted">
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
    </div>
  );
}

/** Thumbnail for sample strip — poster always; video plays only when selected. */
function SampleThumb({
  src,
  poster,
  playing,
}: {
  src: string;
  poster: string;
  playing: boolean;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      void el.play().catch(() => {
        /* ignore autoplay blocks */
      });
      return;
    }
    el.pause();
    try {
      el.currentTime = 0;
    } catch {
      /* ignore seek errors */
    }
  }, [playing]);

  return (
    <>
      {/* Poster always visible so empty black boxes never show while video buffers */}
      <img
        src={poster}
        alt=""
        className={[
          "absolute inset-0 h-full w-full object-cover transition-opacity",
          playing ? "opacity-0" : "opacity-100",
        ].join(" ")}
        draggable={false}
      />
      <video
        ref={ref}
        src={playing ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload={playing ? "auto" : "none"}
        className={[
          "absolute inset-0 h-full w-full object-cover transition-opacity",
          playing ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
    </>
  );
}

function ModeTabIcon({
  mode,
  active,
}: {
  mode: StudioMode;
  active: boolean;
}) {
  const tone = active ? "text-fg" : "text-fg-subtle";
  if (mode === "motion-transfer") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        className={`shrink-0 ${tone}`}
      >
        <circle
          cx="6"
          cy="8"
          r="3.2"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="1.6 1.5"
        />
        <circle
          cx="10"
          cy="8"
          r="3.2"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      </svg>
    );
  }
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={`shrink-0 ${tone}`}
    >
      <rect
        x="2.2"
        y="3.4"
        width="7.2"
        height="7.2"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <rect
        x="6.6"
        y="5.4"
        width="7.2"
        height="7.2"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
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
