"use client";

import { WhatsAppCTA } from "@/components/layout/WhatsAppCTA";
import { getServiceWhatsAppMessage } from "@/lib/whatsapp";

interface ServiceWhatsAppButtonProps {
  slug: string;
  title: string;
}

export function ServiceWhatsAppButton({ slug, title }: ServiceWhatsAppButtonProps) {
  return (
    <WhatsAppCTA
      message={getServiceWhatsAppMessage(slug, title)}
      label="Contact on WhatsApp"
      service={slug}
      className="mt-3 w-full rounded-xl border-2 border-green-600 bg-transparent px-6 py-3 text-sm font-semibold text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/40"
    />
  );
}
