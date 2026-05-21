"use client";

import { ProgramFlyerImage } from "@/components/programs/ProgramFlyerImage";
import { PriceLabel } from "@/components/ui/PriceLabel";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { trackEvent } from "@/lib/analytics";
import { isProgramFlyerImage } from "@/lib/program-flyers";
import { openWhatsApp, getProgramWhatsAppMessage } from "@/lib/whatsapp";
import type { Program } from "@/types";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProgramCardProps {
  program: Program;
  index?: number;
  layout?: "grid" | "carousel";
}

export function ProgramCard({ program, index = 0, layout = "grid" }: ProgramCardProps) {
  const track = useLeadTrackerContext();
  const isFlyer = isProgramFlyerImage(program.image, program.imageType);

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
      className={cn(
        "interactive-card group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-800 bg-navy-900",
        layout === "carousel" && "min-w-[280px] sm:min-w-[320px]"
      )}
    >
      <Link
        href={`/programs/${program.slug}`}
        prefetch
        onClick={handleView}
        className={cn(
          "relative block overflow-hidden bg-navy-950",
          isFlyer ? "aspect-[3/4] sm:aspect-[4/5]" : "aspect-[16/10]"
        )}
      >
        <ProgramFlyerImage
          program={program}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 320px"
          className="transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            isFlyer
              ? "bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent"
              : "bg-gradient-to-t from-navy-950/90 via-transparent to-transparent"
          )}
        />
        {program.badge && (
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-0.5 text-[10px] font-bold text-navy-950 sm:top-4 sm:left-4 sm:px-3 sm:py-1 sm:text-xs">
            <Sparkles className="h-3 w-3" />
            {program.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 rounded-full bg-navy-950/80 px-2 py-0.5 text-[10px] backdrop-blur sm:top-4 sm:right-4 sm:px-3 sm:text-xs">
          <PriceLabel variant="request" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div className="mb-2 flex items-center gap-2 text-xs text-navy-400">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          {formatDate(program.date)}
        </div>
        <Link href={`/programs/${program.slug}`} prefetch onClick={handleView}>
          <h3 className="font-display text-lg font-bold text-white transition-colors group-hover:text-gold-400 sm:text-xl">
            {program.title}
          </h3>
        </Link>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-300 line-clamp-3 sm:mt-3">{program.description}</p>

        <div className="mt-3 sm:mt-4">
          <PriceLabel variant="consultation" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
          <Link
            href={`/programs/${program.slug}`}
            prefetch
            onClick={handleView}
            className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-gold-500/50 px-4 py-2 text-xs font-semibold text-gold-400 transition-all hover:bg-gold-500/10 sm:flex-none sm:px-5 sm:text-sm"
          >
            Learn More
          </Link>
          <Link
            href={program.ctaLink}
            prefetch
            onClick={() => track({ actionType: "program_click", service: program.slug, source: "apply_now" })}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-gold-500 px-4 py-2 text-xs font-semibold text-navy-950 transition-all hover:bg-gold-400 sm:flex-none sm:gap-2 sm:px-5 sm:text-sm"
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
          className="mt-3 text-xs text-navy-400 transition-colors hover:text-green-400 sm:mt-4"
        >
          Or chat on WhatsApp →
        </a>
      </div>
    </motion.article>
  );
}
