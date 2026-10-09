/** fal-ai/wan-motion resolution options. */

export type FalMotionResolution = "480p" | "580p" | "720p";

export const FAL_MOTION_RESOLUTIONS: FalMotionResolution[] = [
  "480p",
  "580p",
  "720p",
];

export const FAL_MOTION_DEFAULT_RESOLUTION: FalMotionResolution = "720p";

export function parseFalMotionResolution(
  value: string | null | undefined,
): FalMotionResolution {
  if (value === "480p" || value === "580p" || value === "720p") return value;
  // Genjutsu 1080p → nearest fal option
  if (value === "1080p") return "720p";
  return FAL_MOTION_DEFAULT_RESOLUTION;
}
