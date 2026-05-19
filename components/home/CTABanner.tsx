"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export function CTABanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 px-8 py-16 text-center md:px-16"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80')] bg-cover bg-center opacity-20" />
      <div className="relative z-10">
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
          Ready to Start Your Adventure?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-navy-200">
          Book your dream vacation today. Our team is ready to craft your perfect itinerary.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/reservation" size="lg">
            Book Your Trip
          </Button>
          <Button href="/contact" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-navy-900">
            Contact Us
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
