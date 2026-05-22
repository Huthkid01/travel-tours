"use client";

import { trackPageView } from "@/lib/analytics";
import {
  getOrCreateVisitSessionId,
  hasRecordedSiteVisit,
  markSiteVisitRecorded,
} from "@/lib/site-session";
import { VISIT_PING_INTERVAL_MS } from "@/lib/visit-active";
import { beaconVisitTrack } from "@/lib/visit-track-client";
import { isExcludedVisitPath } from "@/lib/visit-tracking";
import { trackVisitorAction } from "@/services/tracking";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { TrackActionPayload } from "@/services/tracking";

type TrackFn = (payload: TrackActionPayload) => void;

const LeadTrackerContext = createContext<TrackFn>(() => {});

export function LeadTrackerProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const sessionEndedRef = useRef(false);

  const track = useCallback((payload: TrackActionPayload) => {
    if (isExcludedVisitPath(payload.source ?? pathname)) return;
    void trackVisitorAction(payload);
  }, [pathname]);

  /** One site visit per browser session; heartbeats only while tab is visible */
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

    const endSession = () => {
      if (sessionEndedRef.current) return;
      sessionEndedRef.current = true;
      beaconVisitTrack({
        actionType: "session_end",
        source: window.location.pathname || "/",
        metadata: { sessionId },
      });
    };

    const pingActive = () => {
      if (document.visibilityState !== "visible") return;
      if (isExcludedVisitPath(window.location.pathname)) return;
      sessionEndedRef.current = false;
      track({
        actionType: "active_ping",
        source: window.location.pathname || "/",
        metadata: { sessionId },
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        endSession();
      } else {
        sessionEndedRef.current = false;
        pingActive();
      }
    };

    pingActive();
    const interval = window.setInterval(pingActive, VISIT_PING_INTERVAL_MS);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", endSession);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", endSession);
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
