"use client";

import { fetchAnnouncements } from "@/services/cms";
import type { Announcement } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AnnouncementTicker() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchAnnouncements().then(setItems);
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;

  const current = items[index];

  return (
    <div className="border-b border-gold-500/20 bg-navy-900/50 py-2">
      <div className="container-custom flex items-center gap-3 px-4 text-sm">
        <Megaphone className="h-4 w-4 shrink-0 text-gold-500" />
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="min-w-0 flex-1"
          >
            {current.link ? (
              <Link href={current.link} className="truncate text-navy-200 hover:text-gold-400">
                {current.message}
              </Link>
            ) : (
              <p className="truncate text-navy-200">{current.message}</p>
            )}
          </motion.div>
        </AnimatePresence>
        <Link href="/announcements" className="shrink-0 text-xs font-medium text-gold-500 hover:underline">
          All updates
        </Link>
      </div>
    </div>
  );
}
