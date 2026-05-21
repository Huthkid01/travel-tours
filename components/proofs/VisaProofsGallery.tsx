"use client";

import { visaProofs } from "@/data/visa-proofs";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Shield, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function VisaProofsGallery() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = visaProofs.find((p) => p.id === selected);

  if (visaProofs.length === 0) {
    return (
      <p className="text-center text-navy-600 dark:text-navy-400">
        Visa proof samples will appear here once added to{" "}
        <code className="text-sm text-gold-600">public/proofs/visa/</code>
      </p>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col items-center gap-2 rounded-xl border border-gold-500/20 bg-gold-500/5 px-3 py-3 text-center sm:flex-row sm:gap-3 sm:text-left">
        <Shield className="h-6 w-6 shrink-0 text-gold-500 sm:h-7 sm:w-7" />
        <p className="text-xs text-navy-700 sm:text-sm dark:text-navy-200">
          <strong>Privacy:</strong> Real approval samples with personal details redacted. Tap any card to
          enlarge.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {visaProofs.map((proof, i) => (
          <motion.button
            key={proof.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            onClick={() => {
              trackEvent({ eventType: "button_click", element: `visa_proof_${proof.id}` });
              setSelected(proof.id);
            }}
            className="interactive-card group w-full overflow-hidden rounded-xl border border-navy-200 bg-white text-left dark:border-navy-800 dark:bg-navy-900"
          >
            <div className="relative mx-auto h-32 w-full max-w-[168px] bg-navy-100 sm:h-40 sm:max-w-none lg:h-44 dark:bg-navy-950">
              <Image
                src={proof.image}
                alt={proof.title}
                fill
                className="object-contain p-1 transition-transform duration-300 group-hover:scale-[1.03] sm:p-1.5"
                sizes="(max-width: 640px) 42vw, 200px"
                unoptimized
              />
              <div className="absolute top-1.5 right-1.5 rounded-full bg-navy-950/75 p-1 text-white">
                <ZoomIn className="h-3 w-3" />
              </div>
              <span className="absolute top-1.5 left-1.5 flex items-center gap-0.5 rounded-full bg-gold-500 px-1.5 py-px text-[9px] font-bold text-navy-950">
                <BadgeCheck className="h-2.5 w-2.5" />
                OK
              </span>
            </div>
            <div className="border-t border-navy-100 px-2 py-2 sm:px-3 sm:py-2.5 dark:border-navy-800">
              <p className="text-[9px] font-semibold tracking-wide text-gold-600 uppercase sm:text-[10px]">
                {proof.country}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[11px] font-semibold leading-tight text-navy-900 sm:text-xs dark:text-white">
                {proof.title}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center bg-navy-950/90 p-3"
            onClick={() => setSelected(null)}
          >
            <button
              type="button"
              className="absolute top-3 right-3 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              className={cn(
                "relative max-h-[88vh] w-full max-w-[min(100%,340px)] overflow-hidden rounded-xl bg-white sm:max-w-md dark:bg-navy-900"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[min(50vh,300px)] w-full bg-navy-50 sm:h-[min(55vh,380px)] dark:bg-navy-950">
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  className="object-contain p-2 sm:p-3"
                  sizes="(max-width: 640px) 90vw, 400px"
                  unoptimized
                />
              </div>
              <div className="border-t border-navy-100 px-3 py-2.5 dark:border-navy-800">
                <p className="text-sm font-semibold text-navy-900 dark:text-white">{active.title}</p>
                {active.visaType && (
                  <p className="mt-0.5 text-[11px] text-navy-500">{active.visaType}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
