/** Max billable seconds for a motion-reference upload. */
export const MOTION_TRANSFER_MAX_DURATION_SEC = 30;

/**
 * Billable whole seconds from a media duration (ceil, min 1).
 * Returns null when duration is unknown / non-finite.
 */
export function billableSecondsFromDuration(
  seconds: number,
  maxSec = MOTION_TRANSFER_MAX_DURATION_SEC,
): number | null {
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  return Math.min(maxSec, Math.max(1, Math.ceil(seconds)));
}

/**
 * Read duration from an ISO BMFF (MP4 / MOV) buffer via the `mvhd` box.
 * Returns seconds, or null if not found.
 */
export function probeMp4DurationSeconds(buffer: Buffer): number | null {
  const len = buffer.length;
  let offset = 0;

  while (offset + 8 <= len) {
    let size = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    let header = 8;

    if (size === 1) {
      if (offset + 16 > len) break;
      size = Number(buffer.readBigUInt64BE(offset + 8));
      header = 16;
    } else if (size === 0) {
      size = len - offset;
    }

    if (size < header || offset + size > len) break;

    if (type === "moov" || type === "trak" || type === "mdia") {
      const nested = probeMp4DurationSeconds(
        buffer.subarray(offset + header, offset + size),
      );
      if (nested != null) return nested;
    }

    if (type === "mvhd") {
      const body = offset + header;
      if (body + 20 > len) return null;
      const version = buffer[body];
      if (version === 1) {
        if (body + 32 > len) return null;
        const timescale = buffer.readUInt32BE(body + 20);
        const durationHi = buffer.readUInt32BE(body + 24);
        const durationLo = buffer.readUInt32BE(body + 28);
        const duration = durationHi * 2 ** 32 + durationLo;
        if (timescale > 0 && duration > 0) return duration / timescale;
      } else {
        const timescale = buffer.readUInt32BE(body + 12);
        const duration = buffer.readUInt32BE(body + 16);
        if (timescale > 0 && duration > 0) return duration / timescale;
      }
      return null;
    }

    offset += size;
  }

  return null;
}

/**
 * Best-effort duration probe for uploaded motion video bytes.
 * Supports MP4/MOV containers; returns null for unknown formats.
 */
export function probeVideoDurationSeconds(buffer: Buffer): number | null {
  return probeMp4DurationSeconds(buffer);
}
