import { configureFal, fal, getFalKeyFromEnv } from "@/lib/fal";
import type { FalMotionResolution } from "@/data/fal-motion-resolution";
import { DEFAULT_MOTION_PROMPT } from "@/data/motion-prompt";

const LOG_PREFIX = "[wan-motion-fal]";

/** Same fal endpoint tell uses for /higgsfield-genjutsu motion transfer. */
export const WAN_MOTION_FAL_ENDPOINT = "fal-ai/wan-motion";

type FalVideoFile = { url: string; content_type?: string };
type FalVideoResult = { video?: FalVideoFile };

function log(message: string, data?: Record<string, unknown>) {
  if (data) console.log(`${LOG_PREFIX} ${message}`, data);
  else console.log(`${LOG_PREFIX} ${message}`);
}

async function uploadToFal(buffer: Buffer, mimeType: string): Promise<string> {
  return fal.storage.upload(
    new Blob([new Uint8Array(buffer)], { type: mimeType }),
  );
}

export async function generateWanMotionVideo(params: {
  characterImage: { buffer: Buffer; mimeType: string };
  motionVideo: { buffer: Buffer; mimeType: string };
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

  const [imageUrl, videoUrl] = await Promise.all([
    uploadToFal(
      params.characterImage.buffer,
      params.characterImage.mimeType || "image/jpeg",
    ),
    uploadToFal(
      params.motionVideo.buffer,
      params.motionVideo.mimeType || "video/mp4",
    ),
  ]);

  const prompt =
    params.prompt?.trim() ||
    DEFAULT_MOTION_PROMPT;

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

  const startedAt = Date.now();
  log("subscribe start", {
    endpoint: WAN_MOTION_FAL_ENDPOINT,
    resolution,
    promptLen: prompt.length,
    imageUrl: imageUrl.slice(0, 80),
    videoUrl: videoUrl.slice(0, 80),
  });

  let result: { data?: FalVideoResult };
  try {
    result = await fal.subscribe(WAN_MOTION_FAL_ENDPOINT, {
      input,
      logs: false,
    });
  } catch (error) {
    log("fal error", {
      endpoint: WAN_MOTION_FAL_ENDPOINT,
      ms: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error("We could not create your video this time.");
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
