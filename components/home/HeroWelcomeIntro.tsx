"use client";

import { BRAND } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const INTRO_MS = 2800;

interface HeroWelcomeIntroProps {
  onComplete: () => void;
}

export function HeroWelcomeIntro({ onComplete }: HeroWelcomeIntroProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, INTRO_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="hero-welcome"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-navy-950 px-6 text-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          aria-live="polite"
          aria-label="Welcome"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-900/25 via-navy-950 to-navy-950" />

          <motion.p
            className="relative text-sm font-medium tracking-[0.35em] text-gold-400/90 uppercase sm:text-base"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Welcome to
          </motion.p>

          <motion.h2
            className="relative mt-4 max-w-4xl font-display text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35 }}
          >
            <span className="gradient-text">{BRAND.logoPrimary}</span>{" "}
            <span className="text-white">{BRAND.logoAccent}</span>
          </motion.h2>

          <motion.div
            className="relative mt-10 h-1 w-48 overflow-hidden rounded-full bg-white/10 sm:w-56"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.3 }}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>

          <motion.div
            className="relative mt-8 flex gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            aria-hidden
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-gold-400"
                animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1, 0.85] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
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
