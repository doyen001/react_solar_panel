"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { DEFAULT_DESIGN_MAP_IMAGE } from "./designAssets";

type DesignMapPreviewImageProps = {
  src?: string | null;
};

function resolveMapImageSrc(src?: string | null): string {
  const trimmed = src?.trim();
  return trimmed ? trimmed : DEFAULT_DESIGN_MAP_IMAGE;
}

export function DesignMapPreviewImage({ src }: DesignMapPreviewImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = failed ? DEFAULT_DESIGN_MAP_IMAGE : resolveMapImageSrc(src);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt="Aerial view of property with solar design"
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 33vw"
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
