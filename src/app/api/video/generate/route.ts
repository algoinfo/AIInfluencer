import { NextRequest, NextResponse } from "next/server";
import {
  ANONYMOUS_LOGIN_REQUIRED_MESSAGE,
  requiresLoginForAnonymousGeneration,
} from "@/lib/auth-limits";
import { recordUsage } from "@/lib/auth-service";
import { requireCredits } from "@/lib/credit-charge";
import { creditsForRun } from "@/data/credits";
import {
  creditsForGenjutsuRun,
  GENJUTSU_MIN_DURATION_SEC,
  parseGenjutsuResolution,
} from "@/data/genjutsu-pricing";
import { resolveMotionPrompt } from "@/data/motion-prompt";
import { generateGenjutsuMotionTransfer } from "@/lib/genjutsu-motion-transfer";
import { generateGenjutsuObjectSwap } from "@/lib/genjutsu-object-swap";
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
import { isR2Configured, publicR2Url, uploadToR2 } from "@/lib/r2";
import {
  screenWaffoPrompt,
  WaffoContentSafetyError,
} from "@/lib/waffo-content-safety";
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

function validateImage(file: FormDataEntryValue | null): File {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Character image is required.");
  }
  if (file.size > MOTION_TRANSFER_MAX_IMAGE_BYTES) {
    throw new Error("Character image is too large (max 10 MB).");
  }
  const type = file.type || "image/jpeg";
  if (!MOTION_TRANSFER_ALLOWED_IMAGE_TYPES.has(type)) {
    throw new Error("Character must be PNG, JPG, or WEBP.");
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
 * - object-swap → Higgsfield Genjutsu object-swap
 * Shared: session → Waffo scan-prompt → credits → optional R2 ges/.
 */
export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  try {
    const { payload, session, token, created: sessionCreated } =
      await getRequestSessionFromReq(req);
    const form = await req.formData();

    const mode = parseMode(form.get("mode")?.toString());
    const modelId = (form.get("modelId")?.toString() || "").trim();
    const useGenjutsuMotion =
      mode === "motion-transfer" && modelId === "genjutsu";
    const useGenjutsuPricing = mode === "object-swap" || useGenjutsuMotion;

    const characterFile = validateImage(
      form.get("characterImage") ?? form.get("character"),
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
    const resolution = parseGenjutsuResolution(
      form.get("resolution")?.toString(),
    );
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

    const creditCost = useGenjutsuPricing
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

    // Content safety before charging or calling the model.
    await screenWaffoPrompt({
      prompt: prompt || (mode === "object-swap" ? "object swap" : "motion transfer"),
      locale: "en",
      semantic: "enforce",
      log: (message, data) => log(message, data),
    });

    const chargeLabel = useGenjutsuPricing
      ? `${mode === "object-swap" ? "Object swap" : "Motion transfer"} · genjutsu · ${resolution} · ${durationSec}s · ${creditCost} credits`
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

    // Persist inputs under ges/ when R2 is configured (Kling / fal path only;
    // Genjutsu upload helpers may also write when using public R2 URLs).
    if (
      isR2Configured() &&
      mode === "motion-transfer" &&
      !useGenjutsuMotion
    ) {
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

    let buffer: Buffer;
    if (mode === "object-swap") {
      buffer = await generateGenjutsuObjectSwap({
        characterImage: {
          buffer: characterBuffer,
          mimeType: characterFile.type || "image/jpeg",
          filename: characterFile.name || "character.jpg",
        },
        sourceVideo: {
          buffer: motionBuffer,
          mimeType: motionFile.type || "video/mp4",
          filename: motionFile.name || "motion.mp4",
        },
        prompt,
        resolution,
      });
    } else if (useGenjutsuMotion) {
      buffer = await generateGenjutsuMotionTransfer({
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
      buffer = await generateWanMotionVideo({
        characterImage: {
          buffer: characterBuffer,
          mimeType: characterFile.type || "image/jpeg",
        },
        motionVideo: {
          buffer: motionBuffer,
          mimeType: motionFile.type || "video/mp4",
        },
        prompt,
      });
    }

    let r2Key: string | null = null;
    let videoUrl: string | null = null;
    if (isR2Configured()) {
      const uploaded = await uploadToR2({
        category: "res-video",
        body: buffer,
        filename: `${mode}-${Date.now()}.mp4`,
        contentType: "video/mp4",
      });
      r2Key = uploaded?.key ?? null;
      videoUrl = r2Key ? publicR2Url(r2Key) : null;
    }

    const usage = await recordUsage(token ?? session.token, "generation");

    log("done", {
      mode,
      bytes: buffer.length,
      ms: Date.now() - startedAt,
      r2Key,
      creditCost,
    });

    const headers: Record<string, string> = {
      "Content-Type": "video/mp4",
      "Content-Length": String(buffer.length),
      "Cache-Control": "private, no-store",
      "X-Credits-Charged": String(payload.user ? creditCost : 0),
    };
    if (r2Key) headers["X-R2-Key"] = r2Key;
    if (videoUrl) headers["X-Video-Url"] = videoUrl;

    const res = new NextResponse(new Uint8Array(buffer), { headers });

    if (sessionCreated || usage.created) {
      res.cookies.set(SESSION_COOKIE, usage.session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/",
      });
    }

    return res;
  } catch (error) {
    log("error", {
      ms: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });

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

    const message = error instanceof Error ? error.message : "";
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
