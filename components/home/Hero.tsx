"use client";

import { HeroWelcomeIntro } from "@/components/home/HeroWelcomeIntro";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const HERO_WELCOME_KEY = "darboi-hero-welcome-seen";

export function Hero() {
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(HERO_WELCOME_KEY);
      if (seen) {
        setContentVisible(true);
      } else {
        setShowIntro(true);
      }
    } catch {
      setContentVisible(true);
    } finally {
      setReady(true);
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    try {
      localStorage.setItem(HERO_WELCOME_KEY, "1");
    } catch {
      /* ignore */
    }
    setShowIntro(false);
    setContentVisible(true);
  }, []);

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-900/20 via-navy-950 to-navy-950" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80')] bg-cover bg-center opacity-15" />

      {ready && showIntro && <HeroWelcomeIntro onComplete={handleIntroComplete} />}

      <div
        className={cn(
          "container-custom relative z-10 px-4 py-32 transition-opacity duration-700 sm:px-6 lg:px-8",
          contentVisible ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <AnimatePresence>
          {contentVisible && (
            <motion.div
              key="hero-content"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-sm text-gold-400">
                <Shield className="h-4 w-4" />
                Trusted Documentation & Travel Consultancy
              </span>
              <h1 className="mt-6 font-display text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl">
                Professional Documentation &{" "}
                <span className="gradient-text">Travel Consultation</span> Services
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-navy-200">
                {SITE_CONFIG.description} Based in {SITE_CONFIG.address}.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/services" size="lg">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  href="/services"
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  Our Services
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
