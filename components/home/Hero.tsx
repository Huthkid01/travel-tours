"use client";

import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-900/20 via-navy-950 to-navy-950" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80')] bg-cover bg-center opacity-15" />

      <div className="container-custom relative z-10 px-4 py-32 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
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
            <Button href="/services" variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
              Our Services
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
