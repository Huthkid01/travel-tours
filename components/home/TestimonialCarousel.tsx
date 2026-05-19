"use client";

import { testimonials } from "@/data/testimonials";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const testimonial = testimonials[current];

  const next = () => setCurrent((p) => (p + 1) % testimonials.length);
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="relative mx-auto max-w-4xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-white p-8 shadow-xl dark:bg-navy-900 md:p-12"
        >
          <Quote className="mb-6 h-10 w-10 text-gold-500/30" />
          <div className="mb-4 flex gap-1">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-gold-500 text-gold-500" />
            ))}
          </div>
          <p className="text-lg leading-relaxed text-navy-700 dark:text-navy-200 md:text-xl">
            &ldquo;{testimonial.text}&rdquo;
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={56}
              height={56}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-navy-900 dark:text-white">{testimonial.name}</p>
              <p className="text-sm text-navy-500">{testimonial.location}</p>
              <p className="text-xs text-gold-600">{testimonial.tour}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="rounded-full border border-navy-200 p-2 transition-colors hover:bg-navy-100 dark:border-navy-700 dark:hover:bg-navy-800"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-6 bg-gold-500" : "w-2 bg-navy-200 dark:bg-navy-700"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="rounded-full border border-navy-200 p-2 transition-colors hover:bg-navy-100 dark:border-navy-700 dark:hover:bg-navy-800"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
