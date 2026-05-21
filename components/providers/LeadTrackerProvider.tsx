"use client";

import { trackPageView } from "@/lib/analytics";
import { trackVisitorAction } from "@/services/tracking";
import { createContext, useCallback, useContext, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { TrackActionPayload } from "@/services/tracking";

type TrackFn = (payload: TrackActionPayload) => void;

const LeadTrackerContext = createContext<TrackFn>(() => {});

export function LeadTrackerProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const track = useCallback((payload: TrackActionPayload) => {
    void trackVisitorAction(payload);
  }, []);

  useEffect(() => {
    track({ actionType: "page_view", source: pathname });
    trackPageView(pathname);
  }, [pathname, track]);

  return (
    <LeadTrackerContext.Provider value={track}>{children}</LeadTrackerContext.Provider>
  );
}

export function useLeadTrackerContext() {
  return useContext(LeadTrackerContext);
}
