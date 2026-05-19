"use client";

import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import type { Tour } from "@/types";
import { motion } from "framer-motion";
import { Clock, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TourCardProps {
  tour: Tour;
  index?: number;
}

export function TourCard({ tour, index = 0 }: TourCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-navy-900 card-hover"
    >
      <Link href={`/tour/${tour.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
        {tour.rating && (
          <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-sm font-semibold text-navy-900">
            <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
            {tour.rating}
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-xs font-medium uppercase tracking-wider text-gold-400">
            {tour.country}
          </span>
          <h3 className="mt-1 font-display text-xl font-bold text-white">{tour.title}</h3>
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between text-sm text-navy-600 dark:text-navy-300">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gold-500" />
            {tour.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gold-500" />
            {tour.country}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-navy-500 dark:text-navy-400">From</span>
            <p className="text-2xl font-bold text-gold-600 dark:text-gold-400">
              {formatPrice(tour.price, tour.currency)}
            </p>
          </div>
          <Button href={`/tour/${tour.slug}`} size="sm">
            Book
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
