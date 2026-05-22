"use client";

import { useLiveCms } from "@/hooks/use-live-cms";
import type { Announcement } from "@/types";
import { Megaphone } from "lucide-react";
import Link from "next/link";

export function LiveAnnouncementsList({ initialItems = [] }: { initialItems?: Announcement[] }) {
  const { data: items } = useLiveCms<Announcement[]>("/api/announcements", {
    initial: initialItems,
  });
  const list = items ?? initialItems;

  return (
    <ul className="space-y-4">
      {list.map((a) => (
        <li
          key={a.id}
          className="flex gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-navy-800 dark:bg-navy-900"
        >
          <Megaphone className="mt-1 h-5 w-5 shrink-0 text-gold-500" />
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">{a.type}</span>
            {a.link ? (
              <Link
                href={a.link}
                className="mt-2 block text-lg font-medium text-navy-900 hover:text-gold-600 dark:text-white"
              >
                {a.message}
              </Link>
            ) : (
              <p className="mt-2 text-lg text-navy-800 dark:text-navy-100">{a.message}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
