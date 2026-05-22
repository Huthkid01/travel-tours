"use client";

import { BRAND } from "@/lib/constants";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

const LOAD_DURATION_S = 2.8;

interface HeroWelcomeIntroProps {
  onComplete: () => void;
}

export function HeroWelcomeIntro({ onComplete }: HeroWelcomeIntroProps) {
  const [visible, setVisible] = useState(true);
  const progress = useMotionValue(0);
  const percentLabel = useTransform(progress, (v) => `${Math.round(v)}%`);
  const progressWidth = useTransform(progress, (v) => `${v}%`);

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: LOAD_DURATION_S,
      ease: [0.22, 1, 0.36, 1],
    });

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, LOAD_DURATION_S * 1000 + 400);

    return () => {
      controls.stop();
      window.clearTimeout(hideTimer);
    };
  }, [progress]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="hero-welcome"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-navy-950 px-6 text-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          aria-live="polite"
          aria-busy="true"
          aria-label="Loading welcome"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-900/25 via-navy-950 to-navy-950" />

          <motion.p
            className="relative text-sm font-medium tracking-[0.35em] text-gold-400/90 uppercase sm:text-base"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            Welcome to
          </motion.p>

          <motion.h2
            className="relative mt-4 max-w-4xl font-display text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
          >
            <span className="gradient-text">{BRAND.logoPrimary}</span>{" "}
            <span className="text-white">{BRAND.logoAccent}</span>
          </motion.h2>

          <motion.p
            className="relative mt-8 text-xs font-medium tracking-widest text-navy-300 uppercase sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.35 }}
          >
            Loading experience…
          </motion.p>

          <motion.div
            className="relative mt-6 w-full max-w-xs sm:max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.3 }}
          >
            <div className="mb-2 flex items-center justify-between text-xs text-navy-300">
              <span>Please wait</span>
              <motion.span className="tabular-nums font-semibold text-gold-400">
                {percentLabel}
              </motion.span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300"
                style={{ width: progressWidth }}
              />
            </div>
          </motion.div>

          <motion.div
            className="relative mt-8 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            aria-hidden
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-gold-400"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
