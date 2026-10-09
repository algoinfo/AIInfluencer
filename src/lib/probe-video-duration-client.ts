/** Browser: read duration via a temporary `<video>` element. */
export function probeVideoFileDurationSeconds(file: File): Promise<number | null> {
  return probeVideoFileMeta(file).then((meta) => meta?.durationSec ?? null);
}

export type VideoFileMeta = {
  durationSec: number;
  width: number;
  height: number;
  framePixels: number;
};

/** Browser: duration + frame size for Genjutsu Object Swap pixel checks. */
export function probeVideoFileMeta(file: File): Promise<VideoFileMeta | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(url);
    };
    video.onloadedmetadata = () => {
      const d = video.duration;
      const width = video.videoWidth || 0;
      const height = video.videoHeight || 0;
      cleanup();
      if (!Number.isFinite(d) || d <= 0) {
        resolve(null);
        return;
      }
      resolve({
        durationSec: d,
        width,
        height,
        framePixels: width * height,
      });
    };
    video.onerror = () => {
      cleanup();
      resolve(null);
    };
    video.src = url;
  });
}
