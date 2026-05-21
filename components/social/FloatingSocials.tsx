"use client";

import { SOCIAL_LINKS, getWhatsAppUrl } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  );
}

const items = [
  { key: "whatsapp", href: getWhatsAppUrl(), Icon: MessageCircle, color: "bg-green-500", event: "whatsapp_click" as const },
  { key: "instagram", href: SOCIAL_LINKS.instagram, Icon: Instagram, color: "bg-gradient-to-br from-purple-600 to-pink-500", event: "instagram_click" as const },
  { key: "tiktok", href: SOCIAL_LINKS.tiktok, Icon: TikTokIcon, color: "bg-navy-950 ring-1 ring-navy-700", event: "tiktok_click" as const },
  { key: "facebook", href: SOCIAL_LINKS.facebook, Icon: Facebook, color: "bg-blue-600/80", event: "social_click" as const, title: "Facebook (coming soon)" },
];

export function FloatingSocials() {
  return (
    <div className="fixed right-4 bottom-20 z-[75] flex flex-col gap-2 sm:bottom-24 sm:left-6 sm:right-auto">
      {items.map(({ key, href, Icon, color, event, title }, i) => (
        <motion.a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={title}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 + i * 0.08 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => trackEvent({ eventType: event, element: key, metadata: { source: "floating" } })}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition-shadow hover:shadow-xl",
            color,
            key === "facebook" && "opacity-70"
          )}
          aria-label={key}
        >
          <Icon className="h-5 w-5" />
        </motion.a>
      ))}
    </div>
  );
}
