"use client";

import { images } from "@/lib/images";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK = images.travel;

type RemoteImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
};

/** Reliable external images with fallback when CDN/optimizer fails */
export function RemoteImage({ src, alt, ...props }: RemoteImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      unoptimized
      onError={() => {
        if (imgSrc !== FALLBACK) setImgSrc(FALLBACK);
      }}
    />
  );
}
