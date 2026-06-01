"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** How often open tabs poll for CMS updates (ms). */
export const CMS_LIVE_POLL_MS = 12_000;

type UseLiveCmsOptions<T> = {
  /** SSR / first paint data before first client fetch */
  initial?: T;
  enabled?: boolean;
  /** Override default poll interval (ms) */
  pollMs?: number;
};

export function useLiveCms<T>(url: string, options?: UseLiveCmsOptions<T>) {
  const { initial, enabled = true, pollMs = CMS_LIVE_POLL_MS } = options ?? {};
  const [data, setData] = useState<T | undefined>(initial);
  const [loading, setLoading] = useState(!initial);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    try {
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json?.error) return;
      if (mounted.current) {
        const next = json as T;
        setData((prev) => {
          if (prev !== undefined && JSON.stringify(prev) === JSON.stringify(next)) {
            return prev;
          }
          return next;
        });
        setLoading(false);
      }
    } catch {
      if (mounted.current) setLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    mounted.current = true;
    void refresh();

    if (!enabled) return () => {
      mounted.current = false;
    };

    const interval = setInterval(() => void refresh(), pollMs);

    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const onFocus = () => void refresh();

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);

    return () => {
      mounted.current = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh, enabled, pollMs]);

  return { data, loading, refresh };
}
