"use client";

import { ProgramCard } from "@/components/programs/ProgramCard";
import type { Program } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

interface ProgramsCarouselProps {
  programs: Program[];
}

export function ProgramsCarousel({ programs }: ProgramsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
    setTimeout(updateScroll, 300);
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-navy-900/90 p-2 text-white shadow-lg hover:bg-gold-500 hover:text-navy-950"
          aria-label="Previous"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-navy-900/90 p-2 text-white shadow-lg hover:bg-gold-500 hover:text-navy-950"
          aria-label="Next"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={updateScroll}
        className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide"
      >
        {programs.map((program, i) => (
          <div key={program.id} className="snap-start">
            <ProgramCard program={program} index={i} layout="carousel" />
          </div>
        ))}
      </div>
    </div>
  );
}
