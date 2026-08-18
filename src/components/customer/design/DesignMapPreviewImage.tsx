"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { DEFAULT_DESIGN_MAP_IMAGE } from "./designAssets";

type DesignMapPreviewImageProps = {
  src?: string | null;
  defaultSrc?: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
};

function resolveMapImageSrc(
  src: string | null | undefined,
  defaultSrc: string,
): string {
  const trimmed = src?.trim();
  return trimmed ? trimmed : defaultSrc;
}

export function DesignMapPreviewImage({
  src,
  defaultSrc = DEFAULT_DESIGN_MAP_IMAGE,
  alt = "Aerial view of property with solar design",
  sizes = "(max-width: 1024px) 100vw, 33vw",
  priority = false,
}: DesignMapPreviewImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = failed
    ? defaultSrc
    : resolveMapImageSrc(src, defaultSrc);

  useEffect(() => {
    setFailed(false);
  }, [src, defaultSrc]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      className="object-cover"
      sizes={sizes}
      priority={priority}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
