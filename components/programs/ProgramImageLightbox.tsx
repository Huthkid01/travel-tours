"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface ProgramImageLightboxProps {
  open: boolean;
  onClose: () => void;
  src: string;
  title: string;
}

export function ProgramImageLightbox({ open, onClose, src, title }: ProgramImageLightboxProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[400] flex items-center justify-center bg-navy-950/92 p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — full size`}
        >
          <button
            type="button"
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={cn(
              "relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl",
              "border border-navy-700 bg-navy-900 shadow-2xl"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative min-h-[50vh] flex-1 bg-navy-950">
              <Image
                src={src}
                alt={title}
                fill
                className="object-contain p-4 sm:p-6"
                sizes="(max-width: 768px) 100vw, 672px"
                unoptimized
                priority
              />
            </div>
            <div className="border-t border-navy-800 px-4 py-3 sm:px-5 sm:py-4">
              <p className="font-display text-sm font-semibold text-white sm:text-base">{title}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
