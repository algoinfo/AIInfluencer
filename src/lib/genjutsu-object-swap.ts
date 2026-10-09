import type { GenjutsuResolution } from "@/data/genjutsu-pricing";
import { GENJUTSU_MAX_REFERENCE_IMAGES } from "@/data/genjutsu-pricing";
import {
  subscribeGenjutsuObjectSwap,
  uploadToHiggsfield,
} from "@/lib/higgsfield";
import { isR2Configured, publicR2Url, uploadToR2 } from "@/lib/r2";

const LOG_PREFIX = "[genjutsu-object-swap]";

function log(message: string, data?: Record<string, unknown>) {
  if (data) console.log(`${LOG_PREFIX} ${message}`, data);
  else console.log(`${LOG_PREFIX} ${message}`);
}

async function publicUrlForInput(params: {
  category: "image" | "motion";
  buffer: Buffer;
  filename: string;
  mimeType: string;
}): Promise<string> {
  // Prefer R2 public URLs when available so HF can fetch without re-uploading via CDN.
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

  return uploadToHiggsfield({
    buffer: params.buffer,
    mimeType: params.mimeType,
  });
}

export type ObjectSwapImageInput = {
  buffer: Buffer;
  mimeType: string;
  filename?: string;
};

/**
 * Genjutsu Object Swap — `higgsfield/genjutsu/object-swap/v1.0`
 * Same input shape as motion-transfer: video_url + image_urls (1–8) + optional prompt + resolution.
 */
export async function generateGenjutsuObjectSwap(params: {
  /** 1–8 reference images (characters / objects / styles). */
  referenceImages: ObjectSwapImageInput[];
  sourceVideo: { buffer: Buffer; mimeType: string; filename?: string };
  prompt?: string;
  resolution?: GenjutsuResolution;
}): Promise<Buffer> {
  const refs = params.referenceImages.slice(0, GENJUTSU_MAX_REFERENCE_IMAGES);
  if (refs.length < 1) {
    throw new Error("At least one reference image is required.");
  }

  const [imageUrls, videoUrl] = await Promise.all([
    Promise.all(
      refs.map((image, index) =>
        publicUrlForInput({
          category: "image",
          buffer: image.buffer,
          filename: image.filename || `reference-${index + 1}.jpg`,
          mimeType: image.mimeType || "image/jpeg",
        }),
      ),
    ),
    publicUrlForInput({
      category: "motion",
      buffer: params.sourceVideo.buffer,
      filename: params.sourceVideo.filename || "source.mp4",
      mimeType: params.sourceVideo.mimeType || "video/mp4",
    }),
  ]);

  return subscribeGenjutsuObjectSwap({
    videoUrl,
    imageUrls,
    prompt: params.prompt,
    resolution: params.resolution,
  });
}
