"use client";

import { useState } from "react";

type CoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function CoverImage({ src, alt, className = "", priority }: CoverImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={["cover-fallback", className].filter(Boolean).join(" ")}
        aria-label={alt}
        role="img"
      />
    );
  }

  return (
    // Native img avoids Next image optimizer timeouts on remote fashion photos.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={["cover-image", className].filter(Boolean).join(" ")}
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailed(true)}
    />
  );
}
