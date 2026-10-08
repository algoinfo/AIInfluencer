import type { GenjutsuResolution } from "@/data/genjutsu-pricing";
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

export async function generateGenjutsuObjectSwap(params: {
  characterImage: { buffer: Buffer; mimeType: string; filename?: string };
  sourceVideo: { buffer: Buffer; mimeType: string; filename?: string };
  prompt?: string;
  resolution?: GenjutsuResolution;
}): Promise<Buffer> {
  const [imageUrl, videoUrl] = await Promise.all([
    publicUrlForInput({
      category: "image",
      buffer: params.characterImage.buffer,
      filename: params.characterImage.filename || "reference.jpg",
      mimeType: params.characterImage.mimeType || "image/jpeg",
    }),
    publicUrlForInput({
      category: "motion",
      buffer: params.sourceVideo.buffer,
      filename: params.sourceVideo.filename || "source.mp4",
      mimeType: params.sourceVideo.mimeType || "video/mp4",
    }),
  ]);

  return subscribeGenjutsuObjectSwap({
    videoUrl,
    imageUrls: [imageUrl],
    prompt: params.prompt,
    resolution: params.resolution,
  });
}
