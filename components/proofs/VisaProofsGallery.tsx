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
      <div className="mb-8 flex flex-col items-center gap-3 rounded-2xl border border-gold-500/20 bg-gold-500/5 px-4 py-4 text-center sm:flex-row sm:text-left">
        <Shield className="h-8 w-8 shrink-0 text-gold-500" />
        <p className="text-sm text-navy-700 dark:text-navy-200">
          <strong>Privacy:</strong> These are real approval samples shared with client details and photos
          redacted. They demonstrate successful outcomes — not for identity verification.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visaProofs.map((proof, i) => (
          <motion.button
            key={proof.id}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            onClick={() => {
              trackEvent({ eventType: "button_click", element: `visa_proof_${proof.id}` });
              setSelected(proof.id);
            }}
            className="interactive-card group overflow-hidden rounded-2xl border border-navy-200 bg-white text-left dark:border-navy-800 dark:bg-navy-900"
          >
            <div className="relative aspect-[4/5] bg-navy-100 dark:bg-navy-950">
              <Image
                src={proof.image}
                alt={proof.title}
                fill
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, 320px"
                unoptimized
              />
              <div className="absolute top-3 right-3 rounded-full bg-navy-950/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="h-4 w-4" />
              </div>
              <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold text-navy-950">
                <BadgeCheck className="h-3 w-3" />
                Approved
              </span>
            </div>
            <div className="border-t border-navy-100 p-4 dark:border-navy-800">
              <p className="text-xs font-semibold tracking-wide text-gold-600 uppercase">{proof.country}</p>
              <p className="mt-1 font-semibold text-navy-900 dark:text-white">{proof.title}</p>
              {proof.visaType && (
                <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">{proof.visaType}</p>
              )}
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
                "relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-navy-900"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[3/4] w-full bg-navy-50 dark:bg-navy-950">
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  className="object-contain p-4"
                  sizes="512px"
                  unoptimized
                />
              </div>
              <div className="border-t border-navy-100 p-4 dark:border-navy-800">
                <p className="font-semibold text-navy-900 dark:text-white">{active.title}</p>
                <p className="mt-1 text-xs text-navy-500">Redacted sample — {active.country}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
