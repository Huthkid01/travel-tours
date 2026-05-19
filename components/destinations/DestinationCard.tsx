"use client";

import type { Destination } from "@/types";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DestinationCardProps {
  destination: Destination;
  index?: number;
}

export function DestinationCard({ destination, index = 0 }: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
    >
      <Link href="/tours">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <div className="flex items-center gap-1 text-gold-400">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">{destination.country}</span>
          </div>
          <h3 className="mt-1 font-display text-2xl font-bold text-white">{destination.name}</h3>
          <p className="mt-1 text-sm text-white/70 line-clamp-2">{destination.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-white/60">{destination.tours} tours available</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-navy-950 opacity-0 transition-all group-hover:opacity-100">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
