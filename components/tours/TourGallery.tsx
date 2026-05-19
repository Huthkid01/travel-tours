"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TourGalleryProps {
  images: string[];
  title: string;
}

export function TourGallery({ images, title }: TourGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
        <Image
          src={images[active]}
          alt={`${title} - image ${active + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 80vw"
          priority
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-video overflow-hidden rounded-lg transition-all",
              active === i ? "ring-2 ring-gold-500 ring-offset-2" : "opacity-70 hover:opacity-100"
            )}
          >
            <Image src={img} alt="" fill className="object-cover" sizes="150px" />
          </button>
        ))}
      </div>
    </div>
  );
}
