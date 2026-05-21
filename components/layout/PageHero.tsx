"use client";

import { motion } from "framer-motion";
import { RemoteImage } from "@/components/ui/RemoteImage";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
}

export function PageHero({
  title,
  subtitle,
  image = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80",
}: PageHeroProps) {
  return (
    <section className="relative flex h-[40vh] min-h-[320px] items-center justify-center overflow-hidden">
      <RemoteImage src={image} alt={title} fill className="object-cover" priority sizes="100vw" />
      <div className="absolute inset-0 bg-navy-950/70" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-4 text-center"
      >
        <h1 className="font-display text-4xl font-bold text-white md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-white/80">{subtitle}</p>}
      </motion.div>
    </section>
  );
}
