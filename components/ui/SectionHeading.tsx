"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
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
    </motion.div>
  );
}
