import { NextRequest, NextResponse } from "next/server";
import {
  ANONYMOUS_LOGIN_REQUIRED_MESSAGE,
  requiresLoginForAnonymousGeneration,
} from "@/lib/auth-limits";
import { recordUsage } from "@/lib/auth-service";
import { requireCredits } from "@/lib/credit-charge";
import { creditsForRun } from "@/data/credits";
import { resolveMotionPrompt } from "@/data/motion-prompt";
import { getRequestSessionFromReq } from "@/lib/request-session";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/session-cookie";
import {
  MOTION_TRANSFER_ALLOWED_IMAGE_TYPES,
  MOTION_TRANSFER_ALLOWED_VIDEO_TYPES,
  MOTION_TRANSFER_MAX_IMAGE_BYTES,
  MOTION_TRANSFER_MAX_VIDEO_BYTES,
} from "@/lib/motion-transfer-config";
import { isR2Configured, publicR2Url, uploadToR2 } from "@/lib/r2";
import { generateWanMotionVideo } from "@/lib/wan-motion-fal";

export const runtime = "nodejs";
export const maxDuration = 300;

const LOG_PREFIX = "[video/generate]";

function log(message: string, data?: Record<string, unknown>) {
  if (data) console.log(`${LOG_PREFIX} ${message}`, data);
  else console.log(`${LOG_PREFIX} ${message}`);
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
 * Motion transfer generation — mirrors tell's AI Video / motion-transfer flow:
 * session → credits → fal (wan-motion) → optional R2 save under ges/.
 */
export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  try {
    const { payload, session, token, created: sessionCreated } =
      await getRequestSessionFromReq(req);
    const form = await req.formData();

    const characterFile = validateImage(
      form.get("characterImage") ?? form.get("character"),
    );
    const motionFile = validateVideo(
      form.get("motionVideo") ?? form.get("motion"),
    );
    const prompt = resolveMotionPrompt(form.get("prompt")?.toString() ?? "");
    const durationSec = Math.min(
      30,
      Math.max(1, Number(form.get("durationSec") ?? 5) || 5),
    );
    const modelMultiplier = Math.max(
      1,
      Number(form.get("modelMultiplier") ?? 1) || 1,
    );
    const creditCost = creditsForRun(durationSec, modelMultiplier);

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

    if (payload.user?.email && creditCost > 0) {
      const charged = await requireCredits({
        userEmail: payload.user.email,
        amount: creditCost,
        description: `Motion transfer · ${durationSec}s · ${creditCost} credits`,
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

    const characterBuffer = Buffer.from(await characterFile.arrayBuffer());
    const motionBuffer = Buffer.from(await motionFile.arrayBuffer());

    // Persist inputs under ges/ when R2 is configured (audit / reuse).
    if (isR2Configured()) {
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

    const buffer = await generateWanMotionVideo({
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

    let r2Key: string | null = null;
    let videoUrl: string | null = null;
    if (isR2Configured()) {
      const uploaded = await uploadToR2({
        category: "res-video",
        body: buffer,
        filename: `motion-${Date.now()}.mp4`,
        contentType: "video/mp4",
      });
      r2Key = uploaded?.key ?? null;
      videoUrl = r2Key ? publicR2Url(r2Key) : null;
    }

    const usage = await recordUsage(token ?? session.token, "generation");

    log("done", {
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
    const message = error instanceof Error ? error.message : "";
    if (
      message.includes("required") ||
      message.includes("too large") ||
      message.includes("PNG") ||
      message.includes("MP4") ||
      message.includes("WEBP") ||
      message.includes("WEBM")
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (message.includes("FAL_KEY") || message.includes("not configured")) {
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
