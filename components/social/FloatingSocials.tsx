"use client";

import { TikTokIcon } from "@/components/social/TikTokIcon";
import { SOCIAL_LINKS, getWhatsAppUrl } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const items = [
  { key: "whatsapp", href: getWhatsAppUrl(), Icon: MessageCircle, color: "bg-green-500", event: "whatsapp_click" as const },
  { key: "tiktok", href: SOCIAL_LINKS.tiktok, Icon: TikTokIcon, color: "bg-navy-950 ring-1 ring-navy-700", event: "tiktok_click" as const },
] as const;

export function FloatingSocials() {
  return (
    <div className="fixed right-4 bottom-20 z-[75] flex flex-col gap-2 sm:bottom-24 sm:left-6 sm:right-auto">
      {items.map(({ key, href, Icon, color, event }, i) => (
        <motion.a
          key={key}
          href={href}
          {...(key === "tiktok" ? { target: "_blank", rel: "noopener noreferrer" } : { rel: "noopener noreferrer" })}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 + i * 0.08 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => trackEvent({ eventType: event, element: key, metadata: { source: "floating" } })}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition-shadow hover:shadow-xl",
            color
          )}
          aria-label={key}
        >
          <Icon className="h-5 w-5" />
        </motion.a>
      ))}
    </div>
  );
}
