"use client";

import { ProgramFlyerImage } from "@/components/programs/ProgramFlyerImage";
import { ProgramImageLightbox } from "@/components/programs/ProgramImageLightbox";
import { PriceLabel } from "@/components/ui/PriceLabel";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { trackEvent } from "@/lib/analytics";
import { getProgramFlyerCandidates, isProgramFlyerImage } from "@/lib/program-flyers";
import { openWhatsApp, getProgramWhatsAppMessage } from "@/lib/whatsapp";
import type { Program } from "@/types";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ArrowRight, Sparkles, ZoomIn } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgramCardProps {
  program: Program;
  index?: number;
  layout?: "grid" | "carousel";
  /** Home grid: title, description, consultation only (matches featured layout) */
  variant?: "compact" | "full";
}

export function ProgramCard({
  program,
  index = 0,
  layout = "grid",
  variant = "full",
}: ProgramCardProps) {
  const track = useLeadTrackerContext();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isFlyer = isProgramFlyerImage(program.image, program.imageType);

  const imageSrc = useMemo(
    () => getProgramFlyerCandidates(program.slug, program.image)[0] ?? program.image,
    [program.slug, program.image]
  );

  const handleView = () => {
    track({ actionType: "program_click", service: program.slug, source: "program_card" });
    trackEvent({ eventType: "program_view", element: program.slug, metadata: { title: program.title } });
  };

  const openLightbox = () => {
    trackEvent({ eventType: "button_click", element: `program_image_${program.slug}` });
    setLightboxOpen(true);
  };

  return (
    <>
      <ScrollReveal
        as="article"
        index={index}
        className={cn(
          "interactive-card group flex h-full min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-navy-800 bg-navy-900",
          layout === "carousel" && "min-w-[280px] sm:min-w-[320px]"
        )}
      >
        <button
          type="button"
          onClick={openLightbox}
          aria-label={`View full size: ${program.title}`}
          className={cn(
            "relative block w-full cursor-zoom-in overflow-hidden bg-navy-950 text-left",
            isFlyer
              ? variant === "compact"
                ? "aspect-[3/4]"
                : "aspect-[3/4] sm:aspect-[4/5]"
              : "aspect-[16/10]"
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
            <span className="pointer-events-none absolute top-3 left-3 flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-0.5 text-[10px] font-bold text-navy-950 sm:top-4 sm:left-4 sm:px-3 sm:py-1 sm:text-xs">
              <Sparkles className="h-3 w-3" />
              {program.badge}
            </span>
          )}
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-navy-950/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-4 w-4" />
          </span>
        </button>

        <div className={cn("flex flex-1 flex-col", variant === "compact" ? "p-3 sm:p-4" : "p-4 sm:p-6")}>
          <Link href={`/programs/${program.slug}`} prefetch onClick={handleView}>
            <h3
              className={cn(
                "font-display font-bold text-white transition-colors group-hover:text-gold-400",
                variant === "compact" ? "text-sm leading-snug sm:text-base" : "text-lg sm:text-xl"
              )}
            >
              {program.title}
            </h3>
          </Link>
          <p
            className={cn(
              "mt-2 flex-1 leading-relaxed text-navy-300 line-clamp-3",
              variant === "compact" ? "text-xs sm:text-sm" : "text-sm sm:mt-3"
            )}
          >
            {program.description}
          </p>

          <div className={cn("mt-2", variant === "compact" ? "mt-3" : "mt-3 sm:mt-4")}>
            <PriceLabel variant="consultation" className={variant === "compact" ? "text-xs sm:text-sm" : undefined} />
          </div>

          {variant === "full" && (
            <>
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
            </>
          )}
        </div>
      </ScrollReveal>

      <ProgramImageLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        src={imageSrc}
        title={program.title}
      />
    </>
  );
}
