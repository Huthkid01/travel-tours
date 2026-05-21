"use client";

import { PriceLabel } from "@/components/ui/PriceLabel";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { trackEvent } from "@/lib/analytics";
import { openWhatsApp, getProgramWhatsAppMessage } from "@/lib/whatsapp";
import type { Program } from "@/types";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { RemoteImage } from "@/components/ui/RemoteImage";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface ProgramCardProps {
  program: Program;
  index?: number;
  layout?: "grid" | "carousel";
}

export function ProgramCard({ program, index = 0, layout = "grid" }: ProgramCardProps) {
  const track = useLeadTrackerContext();

  const handleView = () => {
    track({ actionType: "program_click", service: program.slug, source: "program_card" });
    trackEvent({ eventType: "program_view", element: program.slug, metadata: { title: program.title } });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={`interactive-card group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-800 bg-navy-900 ${
        layout === "carousel" ? "min-w-[300px] sm:min-w-[340px]" : ""
      }`}
    >
      <Link href={`/programs/${program.slug}`} prefetch onClick={handleView} className="relative aspect-[16/10] overflow-hidden">
        <RemoteImage
          src={program.image}
          alt={program.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />
        {program.badge && (
          <span className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-navy-950">
            <Sparkles className="h-3 w-3" />
            {program.badge}
          </span>
        )}
        <span className="absolute top-4 right-4 rounded-full bg-navy-950/80 px-3 py-1 text-xs backdrop-blur">
          <PriceLabel variant="request" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center gap-2 text-xs text-navy-400">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(program.date)}
        </div>
        <Link href={`/programs/${program.slug}`} prefetch onClick={handleView}>
          <h3 className="font-display text-xl font-bold text-white transition-colors group-hover:text-gold-400">
            {program.title}
          </h3>
        </Link>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-300 line-clamp-3">{program.description}</p>

        <div className="mt-4">
          <PriceLabel variant="consultation" />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/programs/${program.slug}`}
            onClick={handleView}
            className="inline-flex items-center justify-center rounded-full border-2 border-gold-500/50 px-5 py-2 text-sm font-semibold text-gold-400 transition-all hover:bg-gold-500/10"
          >
            Learn More
          </Link>
          <Link
            href={program.ctaLink}
            prefetch
            onClick={() => track({ actionType: "program_click", service: program.slug, source: "apply_now" })}
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2 text-sm font-semibold text-navy-950 transition-all hover:bg-gold-400"
          >
            Apply Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <a
          href={openWhatsApp(getProgramWhatsAppMessage(program.title))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            track({ actionType: "whatsapp_click", service: program.slug, source: "program_card" });
            trackEvent({ eventType: "whatsapp_click", element: program.slug });
          }}
          className="mt-4 text-xs text-navy-400 transition-colors hover:text-green-400"
        >
          Or chat on WhatsApp →
        </a>
      </div>
    </motion.article>
  );
}
