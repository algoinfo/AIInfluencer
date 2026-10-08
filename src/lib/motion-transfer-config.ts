/** Shared limits for Genjutsu motion transfer (aligned with tell). */

export const MOTION_TRANSFER_MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MOTION_TRANSFER_MAX_VIDEO_BYTES = 80 * 1024 * 1024;

export const MOTION_TRANSFER_ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const MOTION_TRANSFER_ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);
