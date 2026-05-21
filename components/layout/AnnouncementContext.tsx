"use client";

import { fetchAnnouncements } from "@/services/cms";
import type { Announcement } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface AnnouncementContextValue {
  visible: boolean;
}

const AnnouncementContext = createContext<AnnouncementContextValue>({ visible: false });

export function useAnnouncementVisible() {
  return useContext(AnnouncementContext).visible;
}

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Announcement[]>([]);
  const [index, setIndex] = useState(0);
  /** In-memory only — dismiss hides until page refresh, then banner returns */
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchAnnouncements().then((list) => {
      setItems(list);
      if (list.length === 0) setDismissed(true);
    });
  }, []);

  useEffect(() => {
    if (items.length <= 1 || dismissed) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(timer);
  }, [items.length, dismissed]);

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  const visible = items.length > 0 && !dismissed;
  const current = items[index];

  return (
    <AnnouncementContext.Provider value={{ visible }}>
      {visible && (
        <div className="fixed top-0 right-0 left-0 z-[210] h-10 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-navy-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={current?.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="container-custom flex h-10 items-center justify-between gap-4 px-4 text-sm font-medium"
            >
              {current?.link ? (
                <Link
                  href={current.link}
                  prefetch
                  className="flex flex-1 items-center justify-center gap-1 truncate hover:underline"
                >
                  {current.message}
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              ) : (
                <p className="flex-1 truncate text-center">{current?.message}</p>
              )}
              <Link
                href="/announcements"
                prefetch
                className="hidden shrink-0 text-xs font-semibold underline-offset-2 hover:underline sm:inline"
              >
                All updates
              </Link>
              <button
                type="button"
                onClick={dismiss}
                className="shrink-0 rounded p-1 hover:bg-navy-950/10"
                aria-label="Dismiss announcements"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      {children}
    </AnnouncementContext.Provider>
  );
}
