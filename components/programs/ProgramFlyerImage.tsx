"use client";

import {
  getProgramFlyerCandidates,
  isProgramFlyerImage,
  PROGRAM_FLYERS_DIR,
} from "@/lib/program-flyers";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { cn } from "@/lib/utils";
import type { Program } from "@/types";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

interface ProgramFlyerImageProps {
  program: Pick<Program, "slug" | "title" | "image" | "imageType">;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  showPlaceholder?: boolean;
}

function FlyerPlaceholder({ slug, title }: { slug: string; title: string }) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 bg-navy-800/80 p-6 text-center">
      <ImageIcon className="h-10 w-10 text-gold-500/60" />
      <p className="font-display text-sm font-semibold text-white">{title}</p>
      <p className="max-w-xs text-xs leading-relaxed text-navy-400">
        Add flyer:{" "}
        <code className="rounded bg-navy-950 px-1.5 py-0.5 text-gold-400">
          public{PROGRAM_FLYERS_DIR}/{slug}.jpg
        </code>
      </p>
    </div>
  );
}

function ProgramFlyerImageInner({
  program,
  fill = false,
  className,
  sizes = "(max-width: 768px) 100vw, 400px",
  priority = false,
  showPlaceholder = true,
}: ProgramFlyerImageProps) {
  const candidates = useMemo(
    () => getProgramFlyerCandidates(program.slug, program.image, program.imageType),
    [program.slug, program.image, program.imageType]
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [program.slug, program.image]);

  const src = candidates[index];
  const isFlyer = isProgramFlyerImage(src ?? program.image, program.imageType);
  const isLocal = src?.startsWith("/");

  const onError = useCallback(() => {
    setIndex((i) => (i < candidates.length - 1 ? i + 1 : i));
  }, [candidates.length]);

  const imageClass = cn(
    isFlyer ? "object-contain object-center" : "object-cover",
    className
  );

  if (!src && showPlaceholder) {
    return <FlyerPlaceholder slug={program.slug} title={program.title} />;
  }

  if (!src) return null;

  if (isLocal) {
    if (fill) {
      return (
        <Image
          src={src}
          alt={`${program.title} flyer`}
          fill
          className={imageClass}
          sizes={sizes}
          priority={priority}
          onError={onError}
        />
      );
    }
    return (
      <Image
        src={src}
        alt={`${program.title} flyer`}
        width={800}
        height={1060}
        className={cn("h-auto w-full", imageClass)}
        sizes={sizes}
        priority={priority}
        onError={onError}
      />
    );
  }

  if (fill) {
    return (
      <RemoteImage
        src={src}
        alt={`${program.title} flyer`}
        fill
        className={imageClass}
        sizes={sizes}
        priority={priority}
        onError={onError}
      />
    );
  }

  return (
    <RemoteImage
      src={src}
      alt={`${program.title} flyer`}
      width={800}
      height={600}
      className={cn("h-auto w-full", imageClass)}
      sizes={sizes}
      priority={priority}
      onError={onError}
    />
  );
}

export const ProgramFlyerImage = memo(ProgramFlyerImageInner);
