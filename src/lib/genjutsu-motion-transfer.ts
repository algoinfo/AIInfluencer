import type { GenjutsuResolution } from "@/data/genjutsu-pricing";
import {
  subscribeGenjutsuMotionTransfer,
  uploadToHiggsfield,
} from "@/lib/higgsfield";
import { isR2Configured, publicR2Url, uploadToR2 } from "@/lib/r2";

const LOG_PREFIX = "[genjutsu-motion-transfer]";

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

export async function generateGenjutsuMotionTransfer(params: {
  characterImage: { buffer: Buffer; mimeType: string; filename?: string };
  motionVideo: { buffer: Buffer; mimeType: string; filename?: string };
  prompt?: string;
  resolution?: GenjutsuResolution;
}): Promise<Buffer> {
  const [imageUrl, videoUrl] = await Promise.all([
    publicUrlForInput({
      category: "image",
      buffer: params.characterImage.buffer,
      filename: params.characterImage.filename || "character.jpg",
      mimeType: params.characterImage.mimeType || "image/jpeg",
    }),
    publicUrlForInput({
      category: "motion",
      buffer: params.motionVideo.buffer,
      filename: params.motionVideo.filename || "motion.mp4",
      mimeType: params.motionVideo.mimeType || "video/mp4",
    }),
  ]);

  return subscribeGenjutsuMotionTransfer({
    videoUrl,
    imageUrls: [imageUrl],
    prompt: params.prompt,
    resolution: params.resolution,
  });
}
