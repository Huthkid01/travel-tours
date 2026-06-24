"use client";

import { useLiveCms } from "@/hooks/use-live-cms";
import type { Announcement } from "@/types";
import { Megaphone } from "lucide-react";
import Link from "next/link";

export function LiveAnnouncementSidebar({
  initialItems = [],
  layout = "sidebar",
}: {
  initialItems?: Announcement[];
  /** footer = full-width block below programs grid (mobile + desktop) */
  layout?: "sidebar" | "footer";
}) {
  const { data: items } = useLiveCms<Announcement[]>("/api/announcements", {
    initial: initialItems,
  });
  const list = items ?? initialItems;

  if (list.length === 0) return null;

  const isFooter = layout === "footer";

  return (
    <aside
      className={
        isFooter
          ? "w-full rounded-2xl border border-navy-100 bg-white p-5 shadow-lg sm:p-6 dark:border-navy-800 dark:bg-navy-900"
          : "rounded-2xl border border-navy-100 bg-white p-6 shadow-lg dark:border-navy-800 dark:bg-navy-900"
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-gold-500" />
        <h3 className="font-semibold text-navy-900 dark:text-white">Latest Updates</h3>
      </div>
      <ul className="space-y-3">
        {list.slice(0, 5).map((a) => (
          <li key={a.id} className="border-b border-navy-100 pb-3 last:border-0 dark:border-navy-800">
            {a.link ? (
              <Link href={a.link} className="text-sm text-navy-600 hover:text-gold-600 dark:text-navy-300">
                {a.message}
              </Link>
            ) : (
              <p className="text-sm text-navy-600 dark:text-navy-300">{a.message}</p>
            )}
          </li>
        ))}
      </ul>
      <Link href="/announcements" className="mt-4 inline-block text-sm font-medium text-gold-600 hover:underline">
        View all announcements →
      </Link>
    </aside>
  );
}
