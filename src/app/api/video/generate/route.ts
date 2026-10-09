import { after, NextRequest, NextResponse } from "next/server";
import {
  ANONYMOUS_LOGIN_REQUIRED_MESSAGE,
  requiresLoginForAnonymousGeneration,
} from "@/lib/auth-limits";
import { recordUsage } from "@/lib/auth-service";
import { checkCredits, requireCredits } from "@/lib/credit-charge";
import { creditsForRun } from "@/data/credits";
import {
  creditsForGenjutsuRun,
  GENJUTSU_MIN_DURATION_SEC,
  parseGenjutsuResolution,
} from "@/data/genjutsu-pricing";
import { parseFalMotionResolution } from "@/data/fal-motion-resolution";
import {
  creditsForPixverseSwapRun,
  parsePixverseSwapMode,
  parsePixverseSwapResolution,
} from "@/data/pixverse-swap";
import { resolveMotionPrompt } from "@/data/motion-prompt";
import { generateGenjutsuMotionTransfer } from "@/lib/genjutsu-motion-transfer";
import { getRequestSessionFromReq } from "@/lib/request-session";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/session-cookie";
import {
  MOTION_TRANSFER_ALLOWED_IMAGE_TYPES,
  MOTION_TRANSFER_ALLOWED_VIDEO_TYPES,
  MOTION_TRANSFER_MAX_IMAGE_BYTES,
  MOTION_TRANSFER_MAX_VIDEO_BYTES,
} from "@/lib/motion-transfer-config";
import {
  billableSecondsFromDuration,
  MOTION_TRANSFER_MAX_DURATION_SEC,
  probeVideoDurationSeconds,
} from "@/lib/probe-video-duration";
import {
  isR2Configured,
  mirrorRemoteUrlToR2Key,
  planR2Object,
  uploadToR2,
} from "@/lib/r2";
import {
  createGenerationJob,
  saveCompletedGenerationJob,
  saveFailedGenerationJob,
} from "@/lib/generation-jobs";
import { ensureHttpsProxyDispatcher } from "@/lib/https-proxy";
import {
  screenWaffoPrompt,
  WaffoContentSafetyError,
} from "@/lib/waffo-content-safety";
import { generatePixverseSwapVideo } from "@/lib/pixverse-swap-fal";
import { generateWanMotionVideo } from "@/lib/wan-motion-fal";

export const maxDuration = 300;

const LOG_PREFIX = "[video/generate]";

type StudioMode = "motion-transfer" | "object-swap";

function log(message: string, data?: Record<string, unknown>) {
  if (data) console.log(`${LOG_PREFIX} ${message}`, data);
  else console.log(`${LOG_PREFIX} ${message}`);
}

function parseMode(value: string | null | undefined): StudioMode {
  return value === "object-swap" ? "object-swap" : "motion-transfer";
}

function validateImage(
  file: FormDataEntryValue | null,
  label = "Character image",
): File {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error(`${label} is required.`);
  }
  if (file.size > MOTION_TRANSFER_MAX_IMAGE_BYTES) {
    throw new Error(`${label} is too large (max 10 MB).`);
  }
  const type = file.type || "image/jpeg";
  if (!MOTION_TRANSFER_ALLOWED_IMAGE_TYPES.has(type)) {
    throw new Error(`${label} must be PNG, JPG, or WEBP.`);
  }
  return file;
}

function validateVideo(file: FormDataEntryValue | null): File {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Motion video is required.");
  }
  if (file.size > MOTION_TRANSFER_MAX_VIDEO_BYTES) {
    throw new Error("Motion video is too large (max 80 MB).");
  }
  const type = file.type || "video/mp4";
  if (!MOTION_TRANSFER_ALLOWED_VIDEO_TYPES.has(type)) {
    throw new Error("Motion video must be MP4, MOV, or WEBM.");
  }
  return file;
}

/**
 * Studio generation:
 * - motion-transfer + model genjutsu → Higgsfield motion-transfer
 * - motion-transfer + Kling → fal wan-motion
 * - object-swap → fal PixVerse Swap
 * Shared: session → Waffo scan-prompt → credits → optional R2 ges/.
 */
export async function POST(req: NextRequest) {
  ensureHttpsProxyDispatcher();
  const startedAt = Date.now();
  let cloudJobId: string | null = null;
  let jobPersist:
    | {
        sessionId: string;
        userEmail: string;
        clientJobId: string | null;
        title: string;
        product: "motion-transfer" | "object-swap";
        durationSec: number;
        modelMark: string;
        resolution: string;
      }
    | null = null;
  try {
    const { payload, session, token, created: sessionCreated } =
      await getRequestSessionFromReq(req);
    const form = await req.formData();

    const mode = parseMode(form.get("mode")?.toString());
    const modelId = (form.get("modelId")?.toString() || "").trim();
    const useGenjutsuMotion =
      mode === "motion-transfer" && modelId === "genjutsu";
    const usePixverseSwap = mode === "object-swap";
    const useGenjutsuPricing = useGenjutsuMotion;

    const characterFile = validateImage(
      form.get("characterImage") ??
        form.get("character") ??
        form.get("referenceImage"),
      usePixverseSwap ? "Swap image" : "Character image",
    );
    const motionFile = validateVideo(
      form.get("motionVideo") ?? form.get("motion"),
    );
    const rawPrompt = form.get("prompt")?.toString() ?? "";
    const prompt = useGenjutsuPricing
      ? rawPrompt.trim()
      : resolveMotionPrompt(rawPrompt);
    const modelMultiplier = Math.max(
      1,
      Number(form.get("modelMultiplier") ?? 1) || 1,
    );
    const rawResolution = form.get("resolution")?.toString();
    const resolution = parseGenjutsuResolution(rawResolution);
    const falResolution = parseFalMotionResolution(rawResolution);
    const pixverseResolution = parsePixverseSwapResolution(rawResolution);
    const pixverseMode = parsePixverseSwapMode(form.get("swapMode")?.toString());
    const clientDurationHint = Number(form.get("durationSec") ?? 0) || 0;

    const characterBuffer = Buffer.from(await characterFile.arrayBuffer());
    const motionBuffer = Buffer.from(await motionFile.arrayBuffer());

    const probed = probeVideoDurationSeconds(motionBuffer);
    const durationSec =
      billableSecondsFromDuration(probed ?? clientDurationHint) ?? null;
    if (durationSec == null) {
      return NextResponse.json(
        {
          error:
            "Could not read motion video length. Re-export as MP4 and try again.",
        },
        { status: 400 },
      );
    }
    if (
      probed != null &&
      probed > MOTION_TRANSFER_MAX_DURATION_SEC + 0.05
    ) {
      return NextResponse.json(
        {
          error: `Motion video is too long (max ${MOTION_TRANSFER_MAX_DURATION_SEC}s).`,
        },
        { status: 400 },
      );
    }
    if (useGenjutsuPricing && durationSec < GENJUTSU_MIN_DURATION_SEC) {
      return NextResponse.json(
        {
          error: `Genjutsu needs a video at least ${GENJUTSU_MIN_DURATION_SEC}s long.`,
        },
        { status: 400 },
      );
    }

    const creditCost = usePixverseSwap
      ? creditsForPixverseSwapRun(durationSec, pixverseResolution)
      : useGenjutsuPricing
        ? creditsForGenjutsuRun(durationSec, resolution)
        : creditsForRun(durationSec, modelMultiplier);

    if (
      requiresLoginForAnonymousGeneration(
        payload.user,
        payload.usage,
        creditCost,
      )
    ) {
      return NextResponse.json(
        { error: ANONYMOUS_LOGIN_REQUIRED_MESSAGE, needsLogin: true },
        { status: 403 },
      );
    }

    // Fail fast on balance before safety scan / provider work.
    if (payload.user?.email && creditCost > 0) {
      const enough = await checkCredits({
        userEmail: payload.user.email,
        amount: creditCost,
      });
      if (!enough.ok) {
        return NextResponse.json(
          {
            error: `Not enough credits. This video needs ${creditCost.toLocaleString("en-US")} credits — you have ${enough.creditsAvailable.toLocaleString("en-US")}.`,
            needsCredits: true,
            creditsRequired: enough.creditsRequired,
            creditsAvailable: enough.creditsAvailable,
          },
          { status: 402 },
        );
      }
    }

    // Content safety before charging or calling the model.
    await screenWaffoPrompt({
      prompt:
        prompt ||
        (usePixverseSwap ? "pixverse swap" : "motion transfer"),
      locale: "en",
      log: (message, data) => log(message, data),
    });

    const chargeLabel = usePixverseSwap
      ? `PixVerse Swap · ${pixverseMode} · ${pixverseResolution} · ${durationSec}s · ${creditCost} credits`
      : useGenjutsuPricing
        ? `Motion transfer · genjutsu · ${resolution} · ${durationSec}s · ${creditCost} credits`
        : `Motion transfer · ${durationSec}s · ${creditCost} credits`;

    if (payload.user?.email && creditCost > 0) {
      const charged = await requireCredits({
        userEmail: payload.user.email,
        amount: creditCost,
        description: chargeLabel,
      });
      if (!charged.ok) {
        return NextResponse.json(
          {
            error: `Not enough credits. This video needs ${creditCost.toLocaleString("en-US")} credits — you have ${charged.creditsAvailable.toLocaleString("en-US")}.`,
            needsCredits: true,
            creditsRequired: charged.creditsRequired,
            creditsAvailable: charged.creditsAvailable,
          },
          { status: 402 },
        );
      }
    }

    const provider = usePixverseSwap
      ? "fal/pixverse-swap"
      : useGenjutsuMotion
        ? "higgsfield/motion-transfer"
        : "fal/wan-motion";
    const outResolution = usePixverseSwap
      ? pixverseResolution
      : useGenjutsuPricing
        ? resolution
        : falResolution;
    const modelMark =
      form.get("modelMark")?.toString().trim() ||
      (usePixverseSwap
        ? "pv"
        : useGenjutsuMotion
          ? "gj"
          : modelId.toLowerCase().includes("kling")
            ? "kl"
            : "wan");
    const jobTitle =
      characterFile.name.replace(/\.[^.]+$/, "").trim() ||
      (usePixverseSwap ? "PixVerse Swap" : "Motion transfer");

    const clientJobId = form.get("clientJobId")?.toString() ?? null;

    if (payload.user?.email) {
      jobPersist = {
        sessionId: session.id,
        userEmail: payload.user.email,
        clientJobId,
        title: jobTitle.slice(0, 120),
        product: mode,
        durationSec,
        modelMark,
        resolution: outResolution,
      };
      try {
        const job = await createGenerationJob({
          id: clientJobId,
          sessionId: session.id,
          userEmail: payload.user.email,
          title: jobTitle.slice(0, 120),
          product: mode,
          durationSec,
          modelMark,
          resolution: outResolution,
        });
        cloudJobId = job.id;
        log("job created", { jobId: cloudJobId });
      } catch (jobError) {
        log("job create failed — will persist on complete", {
          error:
            jobError instanceof Error ? jobError.message : String(jobError),
          clientJobId,
        });
      }
    }

    log("request", {
      mode,
      modelId: modelId || "(default)",
      provider,
      resolution: outResolution,
      durationSec,
      creditCost,
      imageBytes: characterBuffer.byteLength,
      videoBytes: motionBuffer.byteLength,
      promptLen: prompt.length,
      swapMode: usePixverseSwap ? pixverseMode : undefined,
      user: payload.user?.email ? "logged-in" : "anonymous",
      jobId: cloudJobId,
    });

    // Persist inputs under ges/ when R2 is configured (fal paths).
    if (isR2Configured() && (usePixverseSwap || !useGenjutsuMotion)) {
      void uploadToR2({
        category: "image",
        body: characterBuffer,
        filename: characterFile.name || "character.jpg",
        contentType: characterFile.type || "image/jpeg",
      });
      void uploadToR2({
        category: "motion",
        body: motionBuffer,
        filename: motionFile.name || "motion.mp4",
        contentType: motionFile.type || "video/mp4",
      });
    }

    const providerStartedAt = Date.now();
    log("provider start", { provider, resolution: outResolution });

    let sourceUrl: string;
    try {
      if (usePixverseSwap) {
        sourceUrl = await generatePixverseSwapVideo({
          swapImage: {
            buffer: characterBuffer,
            mimeType: characterFile.type || "image/jpeg",
            filename: characterFile.name || "swap.jpg",
          },
          sourceVideo: {
            buffer: motionBuffer,
            mimeType: motionFile.type || "video/mp4",
            filename: motionFile.name || "source.mp4",
          },
          mode: pixverseMode,
          resolution: pixverseResolution,
        });
      } else if (useGenjutsuMotion) {
        sourceUrl = await generateGenjutsuMotionTransfer({
          characterImage: {
            buffer: characterBuffer,
            mimeType: characterFile.type || "image/jpeg",
            filename: characterFile.name || "character.jpg",
          },
          motionVideo: {
            buffer: motionBuffer,
            mimeType: motionFile.type || "video/mp4",
            filename: motionFile.name || "motion.mp4",
          },
          prompt,
          resolution,
        });
      } else {
        sourceUrl = await generateWanMotionVideo({
          characterImage: {
            buffer: characterBuffer,
            mimeType: characterFile.type || "image/jpeg",
            filename: characterFile.name || "character.jpg",
          },
          motionVideo: {
            buffer: motionBuffer,
            mimeType: motionFile.type || "video/mp4",
            filename: motionFile.name || "motion.mp4",
          },
          prompt,
          resolution: falResolution,
        });
      }
    } catch (providerError) {
      const providerMessage =
        providerError instanceof Error
          ? providerError.message
          : String(providerError);
      log("provider failed", {
        provider,
        resolution: outResolution,
        providerMs: Date.now() - providerStartedAt,
        totalMs: Date.now() - startedAt,
        error: providerMessage,
        jobId: cloudJobId,
      });
      if (jobPersist) {
        await saveFailedGenerationJob({
          id: cloudJobId ?? jobPersist.clientJobId,
          sessionId: jobPersist.sessionId,
          userEmail: jobPersist.userEmail,
          title: jobPersist.title,
          product: jobPersist.product,
          error: providerMessage,
          durationSec: jobPersist.durationSec,
          modelMark: jobPersist.modelMark,
          resolution: jobPersist.resolution,
        })
          .then((job) => {
            cloudJobId = job.id;
            jobPersist = null;
          })
          .catch(() => undefined);
      }
      throw providerError;
    }

    const providerMs = Date.now() - providerStartedAt;
    log("provider done", {
      provider,
      providerMs,
      sourceUrl: sourceUrl.slice(0, 120),
    });

    // Plan R2 key up front, return provider URL immediately for fast playback,
    // and mirror the file to R2 in the background for durable history.
    const planned = planR2Object({
      category: "res-video",
      filename: `${mode}-${Date.now()}.mp4`,
      contentType: "video/mp4",
    });
    const r2Key = planned?.key ?? null;
    const r2Url = planned?.url ?? null;

    if (planned) {
      log("r2 mirror scheduled", { r2Key, r2Url });
      after(async () => {
        const mirrorStartedAt = Date.now();
        const ok = await mirrorRemoteUrlToR2Key({
          sourceUrl,
          key: planned.key,
          contentType: "video/mp4",
        });
        log("r2 mirror finished", {
          r2Key: planned.key,
          ok,
          mirrorMs: Date.now() - mirrorStartedAt,
        });
      });
    } else {
      log("r2 mirror skipped — not configured");
    }

    const historyUrl = r2Url || sourceUrl;
    // Always persist completed generations for logged-in users (Turso).
    if (jobPersist) {
      try {
        const job = await saveCompletedGenerationJob({
          id: cloudJobId ?? jobPersist.clientJobId,
          sessionId: jobPersist.sessionId,
          userEmail: jobPersist.userEmail,
          title: jobPersist.title,
          product: jobPersist.product,
          outputUrl: historyUrl,
          outputR2Key: r2Key,
          durationSec: jobPersist.durationSec,
          modelMark: jobPersist.modelMark,
          resolution: jobPersist.resolution,
        });
        cloudJobId = job.id;
        jobPersist = null;
        log("job saved", {
          jobId: cloudJobId,
          outputUrl: historyUrl.slice(0, 120),
          r2Key,
        });
      } catch (jobError) {
        log("job persist failed", {
          jobId: cloudJobId ?? jobPersist?.clientJobId ?? null,
          error:
            jobError instanceof Error ? jobError.message : String(jobError),
        });
      }
    }

    // Never fail a successful render because Turso/usage bookkeeping broke.
    let usage: Awaited<ReturnType<typeof recordUsage>> | null = null;
    try {
      usage = await recordUsage(token ?? session.token, "generation");
    } catch (usageError) {
      log("usage record failed", {
        error:
          usageError instanceof Error
            ? usageError.message
            : String(usageError),
        jobId: cloudJobId,
      });
    }
    const totalMs = Date.now() - startedAt;

    log("done", {
      mode,
      modelId: modelId || "(default)",
      provider,
      resolution: outResolution,
      durationSec,
      creditCost,
      providerMs,
      totalMs,
      sourceUrl: sourceUrl.slice(0, 120),
      r2Key,
      jobId: cloudJobId,
    });

    const res = NextResponse.json(
      {
        videoUrl: sourceUrl,
        r2Url,
        r2Key,
        jobId: cloudJobId,
        creditsCharged: payload.user ? creditCost : 0,
        providerMs,
        totalMs,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
          "X-Credits-Charged": String(payload.user ? creditCost : 0),
          "X-Provider-Ms": String(providerMs),
          "X-Total-Ms": String(totalMs),
          ...(cloudJobId ? { "X-Job-Id": cloudJobId } : {}),
          ...(r2Key ? { "X-R2-Key": r2Key } : {}),
          ...(r2Url ? { "X-Video-Url": r2Url } : { "X-Video-Url": sourceUrl }),
          "X-Source-Video-Url": sourceUrl,
        },
      },
    );

    const cookieToken = usage?.session.token ?? (sessionCreated ? session.token : null);
    if (cookieToken && (sessionCreated || usage?.created)) {
      res.cookies.set(SESSION_COOKIE, cookieToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/",
      });
    }

    return res;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    log("error", {
      ms: Date.now() - startedAt,
      error: errorMessage,
      jobId: cloudJobId,
    });
    if (jobPersist) {
      await saveFailedGenerationJob({
        id: cloudJobId ?? jobPersist.clientJobId,
        sessionId: jobPersist.sessionId,
        userEmail: jobPersist.userEmail,
        title: jobPersist.title,
        product: jobPersist.product,
        error: errorMessage,
        durationSec: jobPersist.durationSec,
        modelMark: jobPersist.modelMark,
        resolution: jobPersist.resolution,
      }).catch(() => undefined);
    }
    if (error instanceof WaffoContentSafetyError) {
      const status =
        error.code === "prompt_blocked"
          ? 422
          : error.code === "rate_limited"
            ? 429
            : 503;
      return NextResponse.json(
        {
          error: error.message,
          contentSafety: true,
          code: error.code,
          ...(error.requestId ? { requestId: error.requestId } : {}),
        },
        { status },
      );
    }

    const message = errorMessage;
    if (
      message.includes("required") ||
      message.includes("too large") ||
      message.includes("too long") ||
      message.includes("at least") ||
      message.includes("PNG") ||
      message.includes("MP4") ||
      message.includes("WEBP") ||
      message.includes("WEBM")
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (
      message.includes("FAL_KEY") ||
      message.includes("HF_CREDENTIALS") ||
      message.includes("not configured")
    ) {
      return NextResponse.json({ error: message }, { status: 503 });
    }
    return NextResponse.json(
      {
        error:
          message ||
          "Something went wrong. We couldn't create your video this time.",
      },
      { status: 503 },
    );
  }
}
