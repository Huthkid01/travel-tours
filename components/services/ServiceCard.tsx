"use client";

import { PriceLabel } from "@/components/ui/PriceLabel";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { trackEvent } from "@/lib/analytics";
import type { ServiceItem } from "@/types";
import { getLucideIcon } from "@/lib/icons";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ServiceCardProps {
  service: ServiceItem;
  index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const track = useLeadTrackerContext();
  const Icon = getLucideIcon(service.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/services/${service.slug}`}
        prefetch
        onClick={() => {
          track({ actionType: "service_click", service: service.slug, source: "service_card" });
          trackEvent({ eventType: "service_click", element: service.slug });
        }}
        className="interactive-card group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 dark:border-navy-800 dark:bg-navy-900"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-navy-900 group-hover:text-gold-600 dark:text-white">
          {service.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
          {service.shortDescription}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4 dark:border-navy-800">
          <div>
            <p className="text-xs text-navy-500">Pricing</p>
            <PriceLabel variant="contact" />
          </div>
          <span className="flex items-center gap-1 text-xs text-navy-500">
            <Clock className="h-3.5 w-3.5" />
            {service.processingTime}
          </span>
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-600">
          View details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </motion.div>
  );
}
