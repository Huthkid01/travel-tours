"use client";

import { trackPageView } from "@/lib/analytics";
import {
  getOrCreateVisitSessionId,
  hasRecordedSiteVisit,
  markSiteVisitRecorded,
} from "@/lib/site-session";
import { isExcludedVisitPath } from "@/lib/visit-tracking";
import { trackVisitorAction } from "@/services/tracking";
import { createContext, useCallback, useContext, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { TrackActionPayload } from "@/services/tracking";

const ACTIVE_PING_MS = 2 * 60 * 1000;

type TrackFn = (payload: TrackActionPayload) => void;

const LeadTrackerContext = createContext<TrackFn>(() => {});

export function LeadTrackerProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const track = useCallback((payload: TrackActionPayload) => {
    if (isExcludedVisitPath(payload.source ?? pathname)) return;
    void trackVisitorAction(payload);
  }, [pathname]);

  /** One site visit per browser session — not on every page change */
  useEffect(() => {
    const path = window.location.pathname;
    if (isExcludedVisitPath(path)) return;

    const sessionId = getOrCreateVisitSessionId();
    if (!sessionId) return;

    if (!hasRecordedSiteVisit()) {
      markSiteVisitRecorded();
      track({
        actionType: "site_visit",
        source: path || "/",
        metadata: { sessionId },
      });
    }

    const pingActive = () => {
      if (document.visibilityState !== "visible") return;
      if (isExcludedVisitPath(window.location.pathname)) return;
      track({
        actionType: "active_ping",
        source: "/",
        metadata: { sessionId },
      });
    };

    pingActive();
    const interval = window.setInterval(pingActive, ACTIVE_PING_MS);
    document.addEventListener("visibilitychange", pingActive);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", pingActive);
    };
  }, [track]);

  /** GA page paths only — does not increment admin visit counts */
  useEffect(() => {
    if (!isExcludedVisitPath(pathname)) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return (
    <LeadTrackerContext.Provider value={track}>{children}</LeadTrackerContext.Provider>
  );
}

export function useLeadTrackerContext() {
  return useContext(LeadTrackerContext);
}
