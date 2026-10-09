import { configureFal, fal, getFalKeyFromEnv } from "@/lib/fal";
import type {
  PixverseSwapMode,
  PixverseSwapResolution,
} from "@/data/pixverse-swap";
import {
  PIXVERSE_SWAP_DEFAULT_MODE,
  PIXVERSE_SWAP_DEFAULT_RESOLUTION,
} from "@/data/pixverse-swap";
import {
  causeMessage,
  getHttpsProxyUrl,
  isTransientNetworkError,
  resetHttpsProxyAgent,
} from "@/lib/https-proxy";
import { isR2Configured, publicR2Url, uploadToR2 } from "@/lib/r2";

const LOG_PREFIX = "[pixverse-swap-fal]";
const UPLOAD_ATTEMPTS = 3;

export const PIXVERSE_SWAP_FAL_ENDPOINT = "fal-ai/pixverse/swap";

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

export async function generatePixverseSwapVideo(params: {
  swapImage: { buffer: Buffer; mimeType: string; filename?: string };
  sourceVideo: { buffer: Buffer; mimeType: string; filename?: string };
  mode?: PixverseSwapMode;
  resolution?: PixverseSwapResolution;
}): Promise<string> {
  const key = getFalKeyFromEnv();
  if (!key) {
    throw new Error(
      "Video generation is not configured. Set FAL_KEY on the server.",
    );
  }
  configureFal(key);

  const mode = params.mode ?? PIXVERSE_SWAP_DEFAULT_MODE;
  const resolution = params.resolution ?? PIXVERSE_SWAP_DEFAULT_RESOLUTION;
  const startedAt = Date.now();

  let imageUrl: string;
  let videoUrl: string;
  try {
    log("upload start", {
      imageBytes: params.swapImage.buffer.byteLength,
      videoBytes: params.sourceVideo.buffer.byteLength,
      proxy: getHttpsProxyUrl() ? "on" : "off",
      r2Public: Boolean(process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim()),
    });
    imageUrl = await publicUrlForInput({
      category: "image",
      buffer: params.swapImage.buffer,
      filename: params.swapImage.filename || "swap.jpg",
      mimeType: params.swapImage.mimeType || "image/jpeg",
    });
    videoUrl = await publicUrlForInput({
      category: "motion",
      buffer: params.sourceVideo.buffer,
      filename: params.sourceVideo.filename || "source.mp4",
      mimeType: params.sourceVideo.mimeType || "video/mp4",
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

  const input = {
    image_url: imageUrl,
    video_url: videoUrl,
    mode,
    resolution,
    original_sound_switch: true,
    keyframe_id: 1,
  };

  log("subscribe start", {
    endpoint: PIXVERSE_SWAP_FAL_ENDPOINT,
    mode,
    resolution,
    imageUrl: imageUrl.slice(0, 80),
    videoUrl: videoUrl.slice(0, 80),
  });

  let result: { data?: FalVideoResult };
  try {
    result = await (async () => {
      let lastError: unknown;
      for (let attempt = 1; attempt <= UPLOAD_ATTEMPTS; attempt++) {
        try {
          return await fal.subscribe(PIXVERSE_SWAP_FAL_ENDPOINT, {
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
      endpoint: PIXVERSE_SWAP_FAL_ENDPOINT,
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
      endpoint: PIXVERSE_SWAP_FAL_ENDPOINT,
      ms: Date.now() - startedAt,
    });
    throw new Error("Video generation returned no file. Try again.");
  }

  log("success", {
    endpoint: PIXVERSE_SWAP_FAL_ENDPOINT,
    mode,
    resolution,
    ms: Date.now() - startedAt,
    url: outputUrl.slice(0, 120),
  });
  return outputUrl;
}
