"use client";

import { SOCIAL_LINKS } from "@/lib/constants";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";
import { RemoteImage } from "@/components/ui/RemoteImage";

const previews = [
  { id: "1", title: "How to prepare proof of funds", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80" },
  { id: "2", title: "Canada travel tips", image: "https://images.unsplash.com/photo-1519832979-6fa567a88e4a?w=400&q=80" },
  { id: "3", title: "Visa document checklist", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80" },
];

export function TikTokPreview() {
  const track = useLeadTrackerContext();

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        {previews.map((item, i) => (
          <motion.a
            key={item.id}
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onClick={() => track({ actionType: "social_click", service: "tiktok", source: "preview" })}
            className="interactive-card group overflow-hidden rounded-2xl border border-navy-800 bg-navy-900"
          >
            <div className="relative aspect-[9/16] max-h-64">
              <RemoteImage src={item.image} alt={item.title} fill className="object-cover opacity-80" sizes="300px" />
              <div className="absolute inset-0 flex items-center justify-center bg-navy-950/30">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/90 text-navy-950 shadow-lg transition-transform group-hover:scale-110">
                  <Play className="h-6 w-6 fill-current" />
                </span>
              </div>
            </div>
            <p className="p-3 text-sm font-medium text-white">{item.title}</p>
          </motion.a>
        ))}
      </div>
      <a
        href={SOCIAL_LINKS.tiktok}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track({ actionType: "social_click", service: "tiktok", source: "watch_more" })}
        className="mt-6 inline-flex items-center gap-2 font-semibold text-gold-500 transition-colors hover:text-gold-400"
      >
        Watch on TikTok
        <ExternalLink className="h-4 w-4" />
      </a>
      <p className="mt-2 text-sm text-navy-500">{SOCIAL_LINKS.tiktokHandle}</p>
    </div>
  );
}
