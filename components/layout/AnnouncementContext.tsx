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
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
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
        <div
          className="fixed top-0 right-0 left-0 z-[210] flex h-8 items-center bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-navy-950 sm:h-9"
          role="region"
          aria-label="Site announcements"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current?.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex w-full min-w-0 items-center gap-1.5 px-2 sm:container-custom sm:gap-3 sm:px-4"
            >
              <button
                type="button"
                onClick={dismiss}
                className="shrink-0 rounded p-0.5 hover:bg-navy-950/10 sm:p-1"
                aria-label="Dismiss announcement"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              <div className="min-w-0 flex-1 overflow-hidden">
                {current?.link ? (
                  <Link
                    href={current.link}
                    prefetch
                    className="block truncate text-[10px] leading-tight font-medium hover:underline sm:text-xs"
                  >
                    <span className="sm:hidden">{current.message}</span>
                    <span className="hidden items-center gap-0.5 sm:inline-flex sm:text-xs">
                      {current.message}
                      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    </span>
                  </Link>
                ) : (
                  <p className="truncate text-center text-[10px] leading-tight font-medium sm:text-xs">
                    {current?.message}
                  </p>
                )}
              </div>

              <Link
                href="/announcements"
                prefetch
                className="hidden shrink-0 text-[10px] font-semibold underline-offset-2 hover:underline sm:inline sm:text-xs"
              >
                All updates
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      {children}
    </AnnouncementContext.Provider>
  );
}
