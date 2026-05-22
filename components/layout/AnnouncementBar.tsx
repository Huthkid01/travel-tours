"use client";

import type { Announcement } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AnnouncementBar() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((list) => setItems(Array.isArray(list) ? list : []))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (items.length <= 1 || dismissed) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(timer);
  }, [items.length, dismissed]);

  if (dismissed || items.length === 0) return null;

  const current = items[index];

  return (
    <div className="fixed top-0 right-0 left-0 z-210 flex h-10 bg-linear-to-r from-gold-600 via-gold-500 to-gold-600 text-navy-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="container-custom flex h-10 items-center justify-between gap-4 px-4 text-sm font-medium"
        >
          {current.link ? (
            <Link href={current.link} className="flex flex-1 items-center justify-center gap-1 truncate hover:underline">
              {current.message}
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          ) : (
            <p className="flex-1 truncate text-center">{current.message}</p>
          )}
          <Link
            href="/announcements"
            className="hidden shrink-0 text-xs font-semibold underline-offset-2 hover:underline sm:inline"
          >
            All updates
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="shrink-0 rounded p-1 hover:bg-navy-950/10"
            aria-label="Dismiss announcements"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Spacer when announcement bar is visible — use in layout */
export function AnnouncementSpacer() {
  return <div className="h-10" aria-hidden />;
}
