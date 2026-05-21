"use client";

import { SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  );
}

const items = [
  { key: "instagram" as const, Icon: Instagram, href: SOCIAL_LINKS.instagram, color: "bg-gradient-to-br from-purple-600 to-pink-500" },
  { key: "tiktok" as const, Icon: TikTokIcon, href: SOCIAL_LINKS.tiktok, color: "bg-navy-950" },
  { key: "facebook" as const, Icon: Facebook, href: SOCIAL_LINKS.facebook, color: "bg-blue-600" },
];

export function FloatingSocialButtons() {
  const track = useLeadTrackerContext();

  return (
    <div className="fixed left-4 bottom-24 z-[75] flex flex-col gap-2 sm:left-6">
      {items.map(({ key, Icon, href, color }, i) => (
        <motion.a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 + i * 0.1 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => track({ actionType: "social_click", service: key, source: "floating" })}
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
