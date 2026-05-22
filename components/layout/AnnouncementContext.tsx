"use client";

import { useLiveCms } from "@/hooks/use-live-cms";
import {
  announcementBarHeightClass,
  announcementBarShellClass,
  announcementMessageClass,
} from "@/lib/announcement-bar-layout";
import type { Announcement } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const [index, setIndex] = useState(0);
  /** Session-only dismiss — never saved to storage; resets on refresh or route change */
  const [dismissed, setDismissed] = useState(false);

  const { data: liveItems } = useLiveCms<Announcement[]>("/api/announcements", {
    enabled: !isAdminRoute,
  });
  const items = liveItems ?? [];

  useEffect(() => {
    if (!isAdminRoute) setDismissed(false);
  }, [pathname, isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute) return;
    if (items.length === 0) setDismissed(true);
    else if (index >= items.length) setIndex(0);
  }, [isAdminRoute, items.length, index]);

  useEffect(() => {
    if (items.length <= 1 || dismissed) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(timer);
  }, [items.length, dismissed]);

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  const visible = !isAdminRoute && items.length > 0 && !dismissed;
  const current = items[index];

  return (
    <AnnouncementContext.Provider value={{ visible }}>
      {visible && (
        <div
          className={`${announcementBarShellClass} ${announcementBarHeightClass} items-center`}
          role="region"
          aria-label="Site announcements"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current?.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex w-full min-w-0 items-center gap-2 px-3 sm:container-custom sm:gap-3 sm:px-4"
            >
              <button
                type="button"
                onClick={dismiss}
                className="shrink-0 rounded p-1 hover:bg-navy-950/10 sm:p-1.5"
                aria-label="Dismiss announcement for this page"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <div className="min-w-0 flex-1 overflow-hidden">
                {current?.link ? (
                  <Link
                    href={current.link}
                    prefetch
                    className={`block hover:underline ${announcementMessageClass}`}
                  >
                    <span className="inline-flex max-w-full items-center gap-0.5 sm:gap-1">
                      <span className="truncate">{current.message}</span>
                      <ChevronRight className="hidden h-4 w-4 shrink-0 sm:block lg:h-5 lg:w-5" />
                    </span>
                  </Link>
                ) : (
                  <p className={`text-center ${announcementMessageClass}`}>{current?.message}</p>
                )}
              </div>

              <Link
                href="/announcements"
                prefetch
                className="hidden shrink-0 text-xs font-semibold underline-offset-2 hover:underline sm:inline sm:text-sm lg:text-base"
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
