"use client";

import { SOCIAL_LINKS, getWhatsAppUrl, type SocialPlatform } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  );
}

const platforms: {
  key: SocialPlatform | "whatsapp";
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  event: "instagram_click" | "tiktok_click" | "whatsapp_click" | "social_click";
}[] = [
  { key: "instagram", Icon: Instagram, label: "Instagram", href: SOCIAL_LINKS.instagram, event: "instagram_click" },
  { key: "tiktok", Icon: TikTokIcon, label: "TikTok", href: SOCIAL_LINKS.tiktok, event: "tiktok_click" },
  { key: "whatsapp", Icon: MessageCircle, label: "WhatsApp", href: getWhatsAppUrl(), event: "whatsapp_click" },
  { key: "facebook", Icon: Facebook, label: "Facebook", href: SOCIAL_LINKS.facebook, event: "social_click" },
];

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
          title={key === "facebook" ? "Facebook (coming soon)" : label}
          onClick={() =>
            trackEvent({ eventType: event, element: key, metadata: { source: variant } })
          }
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
            base,
            key === "facebook" && "opacity-60"
          )}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
