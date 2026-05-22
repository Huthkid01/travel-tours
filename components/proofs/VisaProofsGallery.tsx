"use client";

import { PriceLabel } from "@/components/ui/PriceLabel";
import { visaProofs } from "@/data/visa-proofs";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Shield, Sparkles, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

/** Matches home program cards: 2-col grid, dark cards, flyer image, consultation footer */
export function VisaProofsGallery() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = visaProofs.find((p) => p.id === selected);

  if (visaProofs.length === 0) {
    return (
      <p className="text-center text-navy-300">
        Visa proof samples will appear here once added to{" "}
        <code className="text-sm text-gold-400">public/proofs/visa/</code>
      </p>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-col items-center gap-3 rounded-2xl border border-gold-500/20 bg-gold-500/5 px-4 py-4 text-center sm:flex-row sm:text-left">
        <Shield className="h-8 w-8 shrink-0 text-gold-500" />
        <p className="text-sm text-navy-200">
          <strong className="text-white">Privacy:</strong> Real approval samples with personal details redacted.
          Tap a card to view full size.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {visaProofs.map((proof, i) => (
          <ScrollReveal
            as="article"
            key={proof.id}
            index={i}
            className="interactive-card group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-800 bg-navy-900"
          >
            <button
              type="button"
              onClick={() => {
                trackEvent({ eventType: "button_click", element: `visa_proof_${proof.id}` });
                setSelected(proof.id);
              }}
              aria-label={`View full size: ${proof.title}`}
              className="relative block w-full cursor-zoom-in overflow-hidden bg-navy-950 text-left"
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={proof.image}
                  alt={proof.title}
                  fill
                  className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-[1.02] sm:p-2"
                  sizes="(max-width: 640px) 45vw, 320px"
                  unoptimized
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent" />
                <span className="pointer-events-none absolute top-2 left-2 flex items-center gap-1 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold text-navy-950 sm:top-3 sm:left-3 sm:px-2.5 sm:text-xs">
                  <BadgeCheck className="h-3 w-3" />
                  Approved
                </span>
                <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-navy-950/70 p-1.5 text-white sm:bottom-3 sm:right-3 sm:p-2">
                  <ZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
              </div>
            </button>

            <div className="flex flex-1 flex-col p-3 sm:p-4">
              <p className="flex items-center gap-1 text-[10px] font-semibold tracking-wide text-gold-400 uppercase sm:text-xs">
                <Sparkles className="h-3 w-3" />
                {proof.country}
              </p>
              <h3 className="mt-1 font-display text-sm font-bold leading-snug text-white sm:text-base">
                {proof.title}
              </h3>
              {proof.visaType && (
                <p className="mt-2 flex-1 text-xs leading-relaxed text-navy-300 line-clamp-3 sm:text-sm">
                  {proof.visaType}
                </p>
              )}
              <div className="mt-3">
                <PriceLabel variant="consultation" className="text-xs sm:text-sm" />
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center bg-navy-950/90 p-4"
            onClick={() => setSelected(null)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className={cn(
                "relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl border border-navy-800 bg-navy-900"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[3/4] max-h-[70vh] w-full bg-navy-950 sm:max-h-none">
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  className="object-contain p-4"
                  sizes="512px"
                  unoptimized
                />
              </div>
              <div className="border-t border-navy-800 p-4">
                <p className="font-semibold text-white">{active.title}</p>
                <p className="mt-1 text-xs text-navy-400">Redacted sample — {active.country}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
