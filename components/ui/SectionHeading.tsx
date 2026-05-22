"use client";

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <ScrollReveal
      className={cn(
        "mb-12 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {label && (
        <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-gold-500">
          {label}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-navy-600 dark:text-navy-300">{description}</p>
      )}
    </ScrollReveal>
  );
}
