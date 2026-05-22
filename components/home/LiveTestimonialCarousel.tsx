"use client";

import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { useLiveCms } from "@/hooks/use-live-cms";
import type { Testimonial } from "@/types";

type LiveTestimonialCarouselProps = {
  initialTestimonials: Testimonial[];
};

export function LiveTestimonialCarousel({ initialTestimonials }: LiveTestimonialCarouselProps) {
  const { data } = useLiveCms<Testimonial[]>("/api/testimonials", {
    initial: initialTestimonials,
  });

  const list = data?.length ? data : initialTestimonials;
  if (!list.length) return null;

  return <TestimonialCarousel testimonials={list} />;
}
