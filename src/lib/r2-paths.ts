/** Cloudflare R2 object prefixes — Genjutsu uses the `ges/` directory. */

export type R2Category = "image" | "motion" | "res-video";

export const R2_PREFIX: Record<R2Category, string> = {
  image: "ges/image/",
  motion: "ges/motion/",
  "res-video": "ges/resvideo/",
};

export const R2_CATEGORIES = Object.keys(R2_PREFIX) as R2Category[];

export function isR2Category(value: string): value is R2Category {
  return R2_CATEGORIES.includes(value as R2Category);
}
