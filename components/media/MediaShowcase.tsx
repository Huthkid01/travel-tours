"use client";

import { mediaShowcaseItems } from "@/data/media-showcase";
import { trackEvent } from "@/lib/analytics";
import type { MediaShowcaseItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ZoomIn } from "lucide-react";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { useState } from "react";

const categories = [
  { id: "all", label: "All" },
  { id: "travel", label: "Travel" },
  { id: "documents", label: "Documents" },
  { id: "success", label: "Success Stories" },
  { id: "social", label: "Social" },
] as const;

export function MediaShowcase() {
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<MediaShowcaseItem | null>(null);

  const filtered =
    filter === "all"
      ? mediaShowcaseItems
      : mediaShowcaseItems.filter((i) => i.category === filter);

  const openItem = (item: MediaShowcaseItem) => {
    trackEvent({ eventType: "button_click", element: `media_${item.id}`, metadata: { category: item.category } });
    if (item.externalUrl) {
      if (item.externalUrl.startsWith("/")) {
        window.location.href = item.externalUrl;
      } else {
        window.open(item.externalUrl, "_blank");
      }
      return;
    }
    setSelected(item);
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === c.id ? "bg-gold-500 text-navy-950" : "bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={() => openItem(item)}
            className="interactive-card group relative aspect-[4/3] overflow-hidden rounded-2xl text-left"
          >
            <RemoteImage src={item.src} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="400px" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
            <div className="absolute right-3 top-3 rounded-full bg-navy-950/60 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
              {item.type === "video" ? <Play className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            </div>
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-xs uppercase tracking-wider text-gold-400">{item.category}</p>
              <p className="font-semibold text-white">{item.title}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center bg-navy-950/90 p-4"
            onClick={() => setSelected(null)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <RemoteImage
                src={selected.src}
                alt={selected.title}
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto object-contain"
              />
              <p className="absolute bottom-0 left-0 right-0 bg-navy-950/80 p-4 text-center text-white">
                {selected.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
