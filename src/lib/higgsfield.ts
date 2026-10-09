import { config as configureV2, higgsfield } from "@higgsfield/client/v2";
import type { GenjutsuResolution } from "@/data/genjutsu-pricing";

const LOG_PREFIX = "[higgsfield]";
const HF_API_BASE = "https://api.higgsfield.ai";

function log(message: string, data?: Record<string, unknown>) {
  if (data) console.log(`${LOG_PREFIX} ${message}`, data);
  else console.log(`${LOG_PREFIX} ${message}`);
}

/** `KEY_ID:KEY_SECRET` from HF_CREDENTIALS or HF_KEY. */
export function getHiggsfieldCredentialsFromEnv(): string | null {
  const raw =
    process.env.HF_CREDENTIALS?.trim() || process.env.HF_KEY?.trim() || "";
  if (!raw || !raw.includes(":")) return null;
  return raw;
}

let v2Configured = false;

function ensureV2Configured(credentials: string) {
  if (v2Configured) return;
  configureV2({
    credentials,
    // Object Swap can run longer than the SDK default poll window.
    maxPollTime: 10 * 60 * 1000,
    pollInterval: 2500,
    timeout: 120_000,
  });
  v2Configured = true;
}

type UploadSlot = {
  public_url: string;
  upload_url: string;
  content_type?: string;
  upload_headers?: Record<string, string>;
};

/**
 * Upload bytes to Higgsfield CDN via presigned URL.
 * HF upload supports image/jpeg|png|webp|gif and video/mp4.
 */
export async function uploadToHiggsfield(params: {
  buffer: Buffer;
  mimeType: string;
}): Promise<string> {
  const credentials = getHiggsfieldCredentialsFromEnv();
  if (!credentials) {
    throw new Error(
      "Genjutsu is not configured. Set HF_CREDENTIALS (KEY_ID:KEY_SECRET) on the server.",
    );
  }

  let contentType = params.mimeType || "application/octet-stream";
  // Presigned upload list is narrow — normalize MOV/WEBM to mp4 content-type.
  if (contentType === "video/quicktime" || contentType === "video/webm") {
    contentType = "video/mp4";
  }
  if (contentType === "image/jpg") contentType = "image/jpeg";

  log("upload start", {
    contentType,
    bytes: params.buffer.byteLength,
  });

  const slotRes = await fetch(`${HF_API_BASE}/files/generate-upload-url`, {
    method: "POST",
    headers: {
      Authorization: `Key ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content_type: contentType }),
  });
  if (!slotRes.ok) {
    const detail = await slotRes.text().catch(() => "");
    throw new Error(
      detail || "Could not create a Higgsfield upload URL.",
    );
  }
  const slot = (await slotRes.json()) as UploadSlot;
  if (!slot.upload_url || !slot.public_url) {
    throw new Error("Higgsfield upload URL response was incomplete.");
  }

  const putHeaders: Record<string, string> = {
    ...(slot.upload_headers || {}),
  };
  if (!putHeaders["Content-Type"] && !putHeaders["content-type"]) {
    putHeaders["Content-Type"] = slot.content_type || contentType;
  }

  const putRes = await fetch(slot.upload_url, {
    method: "PUT",
    headers: putHeaders,
    body: new Uint8Array(params.buffer),
  });
  if (!putRes.ok) {
    throw new Error("Could not upload media to Higgsfield storage.");
  }

  log("upload ok", { url: slot.public_url.slice(0, 80) });
  return slot.public_url;
}

export type GenjutsuEndpoint =
  | "higgsfield/genjutsu/object-swap/v1.0"
  | "higgsfield/genjutsu/motion-transfer/v1.0";

export async function subscribeGenjutsuVideo(params: {
  endpoint: GenjutsuEndpoint;
  videoUrl: string;
  imageUrls: string[];
  prompt?: string;
  resolution?: GenjutsuResolution;
}): Promise<Buffer> {
  const credentials = getHiggsfieldCredentialsFromEnv();
  if (!credentials) {
    throw new Error(
      "Genjutsu is not configured. Set HF_CREDENTIALS (KEY_ID:KEY_SECRET) on the server.",
    );
  }
  ensureV2Configured(credentials);

  const resolution = params.resolution ?? "720p";
  // HF schema: prompt optional, maxLength 10000; default "".
  const prompt = (params.prompt?.trim() ?? "").slice(0, 10_000);
  const imageUrls = params.imageUrls.filter(Boolean).slice(0, 8); // HF maxItems: 8
  if (!params.videoUrl?.trim()) {
    throw new Error("Source video URL is required.");
  }
  if (imageUrls.length < 1) {
    throw new Error("At least one reference image is required.");
  }

  log("subscribe start", {
    endpoint: params.endpoint,
    resolution,
    images: imageUrls.length,
  });

  const result = await higgsfield.subscribe(params.endpoint, {
    input: {
      prompt,
      video_url: params.videoUrl,
      image_urls: imageUrls,
      resolution,
    },
    withPolling: true,
  });

  // Status union differs across @higgsfield/client versions — compare as string.
  const status = String(result.status);
  if (status === "nsfw") {
    throw new Error("This request was blocked by content safety.");
  }
  if (status !== "completed" || !result.video?.url) {
    const apiErrorRaw = (result as unknown as { error?: unknown }).error;
    const apiError =
      typeof apiErrorRaw === "string" ? apiErrorRaw.trim() : "";
    throw new Error(
      apiError ||
        (status === "failed" || status === "canceled"
          ? "We could not create your video this time."
          : "Video generation returned no file. Try again."),
    );
  }

  const videoRes = await fetch(result.video.url);
  if (!videoRes.ok) {
    throw new Error("Could not download the generated video.");
  }
  const arrayBuffer = await videoRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export function subscribeGenjutsuObjectSwap(params: {
  videoUrl: string;
  imageUrls: string[];
  prompt?: string;
  resolution?: GenjutsuResolution;
}): Promise<Buffer> {
  return subscribeGenjutsuVideo({
    endpoint: "higgsfield/genjutsu/object-swap/v1.0",
    ...params,
  });
}

export function subscribeGenjutsuMotionTransfer(params: {
  videoUrl: string;
  imageUrls: string[];
  prompt?: string;
  resolution?: GenjutsuResolution;
}): Promise<Buffer> {
  return subscribeGenjutsuVideo({
    endpoint: "higgsfield/genjutsu/motion-transfer/v1.0",
    ...params,
  });
}
