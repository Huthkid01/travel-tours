"use client";

import { Button } from "@/components/ui/Button";
import { heroSlides } from "@/data/hero-slides";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.image;
    });
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-navy-950">
      <div className="pointer-events-none absolute inset-0 z-0">
        {heroSlides.map((s, index) => (
          <motion.div
            key={s.id}
            initial={false}
            animate={{ opacity: index === current ? 1 : 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{ zIndex: index === current ? 2 : 1 }}
            aria-hidden={index !== current}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              priority={index <= 1}
              loading={index <= 1 ? "eager" : "lazy"}
              className="object-cover"
              sizes="100vw"
              quality={75}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/50 to-navy-950/80" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-30 flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl">
          <span className="mb-4 inline-block rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-sm font-medium text-gold-400 backdrop-blur-sm">
            Premium Travel Experiences
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {current === 0 ? (
              <>
                Explore the World <span className="gradient-text">With Ease</span>
              </>
            ) : (
              slide.title
            )}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">{slide.subtitle}</p>
          <div className="relative z-50 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/reservation" size="lg">
              Book Now
            </Button>
            <Button
              href="/tours"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-navy-950"
            >
              View Packages
            </Button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute top-1/2 left-4 z-40 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute top-1/2 right-4 z-40 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-8 bg-gold-500" : "w-2 bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-navy-950 to-transparent" />
    </section>
  );
}
