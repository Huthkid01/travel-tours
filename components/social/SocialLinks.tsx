"use client";

import { TikTokIcon } from "@/components/social/TikTokIcon";
import { SOCIAL_LINKS, getWhatsAppUrl } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

const platforms = [
  { key: "tiktok", Icon: TikTokIcon, label: "TikTok", href: SOCIAL_LINKS.tiktok, event: "tiktok_click" as const },
  { key: "whatsapp", Icon: MessageCircle, label: "WhatsApp", href: getWhatsAppUrl(), event: "whatsapp_click" as const },
] as const;

interface SocialLinksProps {
  className?: string;
  variant?: "default" | "footer" | "navbar";
}

export function SocialLinks({ className, variant = "default" }: SocialLinksProps) {
  const base =
    variant === "footer"
      ? "bg-navy-800 text-navy-300 hover:bg-gold-500 hover:text-navy-950"
      : variant === "navbar"
        ? "text-navy-600 hover:text-gold-500 dark:text-navy-300"
        : "bg-navy-900/80 text-white hover:bg-gold-500 hover:text-navy-950";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {platforms.map(({ key, Icon, label, href, event }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          onClick={() =>
            trackEvent({ eventType: event, element: key, metadata: { source: variant } })
          }
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
            base
          )}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
