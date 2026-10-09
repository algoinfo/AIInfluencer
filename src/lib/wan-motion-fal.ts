import { configureFal, fal, getFalKeyFromEnv } from "@/lib/fal";
import type { FalMotionResolution } from "@/data/fal-motion-resolution";
import { DEFAULT_MOTION_PROMPT } from "@/data/motion-prompt";
import {
  causeMessage,
  getHttpsProxyUrl,
  isTransientNetworkError,
  resetHttpsProxyAgent,
} from "@/lib/https-proxy";
import { isR2Configured, publicR2Url, uploadToR2 } from "@/lib/r2";

const LOG_PREFIX = "[wan-motion-fal]";
const UPLOAD_ATTEMPTS = 3;

/** Same fal endpoint tell uses for /higgsfield-genjutsu motion transfer. */
export const WAN_MOTION_FAL_ENDPOINT = "fal-ai/wan-motion";

type FalVideoFile = { url: string; content_type?: string };
type FalVideoResult = { video?: FalVideoFile };

function log(message: string, data?: Record<string, unknown>) {
  if (data) console.log(`${LOG_PREFIX} ${message}`, data);
  else console.log(`${LOG_PREFIX} ${message}`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadToFal(buffer: Buffer, mimeType: string): Promise<string> {
  return fal.storage.upload(
    new Blob([new Uint8Array(buffer)], { type: mimeType }),
  );
}

async function uploadToFalWithRetry(
  buffer: Buffer,
  mimeType: string,
  label: string,
): Promise<string> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= UPLOAD_ATTEMPTS; attempt++) {
    try {
      const url = await uploadToFal(buffer, mimeType);
      if (attempt > 1) log("upload retry ok", { label, attempt });
      return url;
    } catch (error) {
      lastError = error;
      const transient = isTransientNetworkError(error);
      log("upload attempt failed", {
        label,
        attempt,
        transient,
        error:
          causeMessage(error) ||
          (error instanceof Error ? error.message : String(error)),
      });
      if (!transient || attempt === UPLOAD_ATTEMPTS) break;
      resetHttpsProxyAgent();
      const retryKey = getFalKeyFromEnv();
      if (retryKey) configureFal(retryKey);
      await sleep(400 * attempt);
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(String(lastError ?? "fal upload failed"));
}

/** Prefer stable R2 public URLs; fall back to fal CDN (needs proxy locally). */
async function publicUrlForInput(params: {
  category: "image" | "motion";
  buffer: Buffer;
  filename: string;
  mimeType: string;
}): Promise<string> {
  if (isR2Configured()) {
    const uploaded = await uploadToR2({
      category: params.category,
      body: params.buffer,
      filename: params.filename,
      contentType: params.mimeType,
    });
    const url = uploaded?.key ? publicR2Url(uploaded.key) : null;
    if (url) {
      log("using R2 public url", { category: params.category });
      return url;
    }
  }

  return uploadToFalWithRetry(params.buffer, params.mimeType, params.category);
}

export async function generateWanMotionVideo(params: {
  characterImage: { buffer: Buffer; mimeType: string; filename?: string };
  motionVideo: { buffer: Buffer; mimeType: string; filename?: string };
  prompt?: string;
  resolution?: FalMotionResolution;
}): Promise<string> {
  const key = getFalKeyFromEnv();
  if (!key) {
    throw new Error(
      "Video generation is not configured. Set FAL_KEY on the server.",
    );
  }
  configureFal(key);

  const startedAt = Date.now();
  let imageUrl: string;
  let videoUrl: string;
  try {
    log("upload start", {
      imageBytes: params.characterImage.buffer.byteLength,
      videoBytes: params.motionVideo.buffer.byteLength,
      proxy: getHttpsProxyUrl() ? "on" : "off",
      r2Public: Boolean(process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim()),
    });
    // Sequential uploads: parallel fal PUTs often trip flaky local proxies.
    imageUrl = await publicUrlForInput({
      category: "image",
      buffer: params.characterImage.buffer,
      filename: params.characterImage.filename || "character.jpg",
      mimeType: params.characterImage.mimeType || "image/jpeg",
    });
    videoUrl = await publicUrlForInput({
      category: "motion",
      buffer: params.motionVideo.buffer,
      filename: params.motionVideo.filename || "motion.mp4",
      mimeType: params.motionVideo.mimeType || "video/mp4",
    });
    log("upload done", {
      ms: Date.now() - startedAt,
      imageUrl: imageUrl.slice(0, 80),
      videoUrl: videoUrl.slice(0, 80),
    });
  } catch (error) {
    const detail =
      causeMessage(error) ||
      (error instanceof Error ? error.message : String(error));
    log("upload failed", {
      ms: Date.now() - startedAt,
      error: detail,
      proxy: getHttpsProxyUrl() ? "on" : "off",
    });
    throw new Error(
      detail.toLowerCase().includes("fetch failed") ||
        /timeout|ENOTFOUND|ECONN|TLS|socket disconnected/i.test(detail)
        ? `Could not reach fal (${detail}). Check HTTPS_PROXY / Clash, then retry.`
        : detail || "Could not upload assets to fal.",
    );
  }

  const prompt = params.prompt?.trim() || DEFAULT_MOTION_PROMPT;

  const resolution = params.resolution ?? "720p";
  const input = {
    image_url: imageUrl,
    video_url: videoUrl,
    prompt,
    resolution,
    adapt_motion: true,
    acceleration: "regular" as const,
    enable_safety_checker: true,
  };

  log("subscribe start", {
    endpoint: WAN_MOTION_FAL_ENDPOINT,
    resolution,
    promptLen: prompt.length,
    imageUrl: imageUrl.slice(0, 80),
    videoUrl: videoUrl.slice(0, 80),
  });

  let result: { data?: FalVideoResult };
  try {
    result = await (async () => {
      let lastError: unknown;
      for (let attempt = 1; attempt <= UPLOAD_ATTEMPTS; attempt++) {
        try {
          return await fal.subscribe(WAN_MOTION_FAL_ENDPOINT, {
            input,
            logs: false,
          });
        } catch (error) {
          lastError = error;
          if (!isTransientNetworkError(error) || attempt === UPLOAD_ATTEMPTS) {
            throw error;
          }
          log("subscribe retry", {
            attempt,
            error:
              causeMessage(error) ||
              (error instanceof Error ? error.message : String(error)),
          });
          resetHttpsProxyAgent();
          configureFal(key);
          await sleep(600 * attempt);
        }
      }
      throw lastError instanceof Error
        ? lastError
        : new Error(String(lastError ?? "fal subscribe failed"));
    })();
  } catch (error) {
    const detail =
      causeMessage(error) ||
      (error instanceof Error ? error.message : String(error));
    log("fal error", {
      endpoint: WAN_MOTION_FAL_ENDPOINT,
      ms: Date.now() - startedAt,
      error: detail,
    });
    throw new Error(
      detail.toLowerCase().includes("fetch failed") ||
        /timeout|ENOTFOUND|ECONN|TLS|socket disconnected/i.test(detail)
        ? `Could not reach fal (${detail}). Check HTTPS_PROXY / Clash, then retry.`
        : "We could not create your video this time.",
    );
  }

  const outputUrl = result.data?.video?.url;
  if (!outputUrl) {
    log("fal empty result", {
      endpoint: WAN_MOTION_FAL_ENDPOINT,
      ms: Date.now() - startedAt,
    });
    throw new Error("Video generation returned no file. Try again.");
  }

  log("success", {
    endpoint: WAN_MOTION_FAL_ENDPOINT,
    resolution,
    ms: Date.now() - startedAt,
    url: outputUrl.slice(0, 120),
  });
  return outputUrl;
}
