/** Used when the optional studio prompt field is empty. */
export const DEFAULT_MOTION_PROMPT =
  "Preserve the identity and visual appearance of the reference image. Accurately transfer the motion, timing, and camera movement from the reference video while maintaining consistent details throughout the generated video.";

export function resolveMotionPrompt(userPrompt: string): string {
  const trimmed = userPrompt.trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_MOTION_PROMPT;
}
