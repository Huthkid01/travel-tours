"use client";

import { getWhatsAppUrl } from "@/lib/constants";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface WhatsAppCTAProps {
  message: string;
  label?: string;
  className?: string;
  variant?: "button" | "link" | "floating";
  service?: string;
}

export function WhatsAppCTA({
  message,
  label = "Chat on WhatsApp",
  className,
  variant = "button",
  service,
}: WhatsAppCTAProps) {
  const track = useLeadTrackerContext();
  const href = getWhatsAppUrl(message);

  const base =
    variant === "floating"
      ? "fixed right-6 bottom-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 hover:shadow-xl"
      : variant === "link"
        ? "inline-flex items-center gap-2 text-sm font-medium text-green-500 hover:text-green-400"
        : "inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition-all hover:bg-green-500 hover:shadow-lg";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={() =>
        track({
          actionType: "whatsapp_click",
          service: service ?? "general",
          source: variant,
        })
      }
      className={cn(base, className)}
    >
      <MessageCircle className={variant === "floating" ? "h-7 w-7" : "h-5 w-5"} />
      {variant !== "floating" && label}
    </a>
  );
}
