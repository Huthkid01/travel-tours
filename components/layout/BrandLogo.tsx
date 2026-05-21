"use client";

import { BRAND } from "@/lib/constants";
import { BRANDING_ASSETS } from "@/lib/branding";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface BrandLogoProps {
  /** @deprecated Variants unused — logo uses white backing for all backgrounds */
  variant?: "default" | "light" | "dark";
  textClassName?: string;
  className?: string;
  /** Taller logo for footer */
  size?: "nav" | "footer";
}

export function BrandLogo({ className, textClassName, size = "nav" }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  const heightClass = size === "footer" ? "h-14 sm:h-16" : "h-11 sm:h-12";
  const maxWidth = size === "footer" ? "max-w-[220px]" : "max-w-[200px]";

  if (failed) {
    return (
      <span className={cn("flex items-center gap-2", className)}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500">
          <Building2 className="h-5 w-5 text-navy-950" />
        </span>
        <span className={cn("font-display text-xl font-bold", textClassName)}>
          {BRAND.logoPrimary}
          <span className="text-gold-500"> {BRAND.logoAccent}</span>
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-lg bg-white px-2.5 py-1 shadow-md ring-1 ring-black/5",
        className
      )}
      title={BRAND.name}
    >
      <Image
        src={BRANDING_ASSETS.logo}
        alt={`${BRAND.name} logo`}
        width={200}
        height={137}
        className={cn(heightClass, maxWidth, "w-auto object-contain object-left")}
        onError={() => setFailed(true)}
        priority
        unoptimized
      />
    </span>
  );
}
