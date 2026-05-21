"use client";

import { NAV_LINKS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const EXTRA_ROUTES = ["/contact", "/about", "/announcements", "/success"];

/** Warm common routes so clicks feel instant */
export function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    const routes = [
      ...new Set([
        ...NAV_LINKS.map((l) => l.href.split("#")[0] || "/").filter(Boolean),
        ...EXTRA_ROUTES,
      ]),
    ];
    routes.forEach((href) => {
      try {
        router.prefetch(href);
      } catch {
        /* ignore prefetch errors in dev */
      }
    });
  }, [router]);

  return null;
}
