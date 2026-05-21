"use client";

import { trackVisitorAction, type TrackActionPayload } from "@/services/tracking";
import { useCallback } from "react";

export function useLeadTracker() {
  const track = useCallback((payload: TrackActionPayload) => {
    void trackVisitorAction(payload);
  }, []);

  return { track };
}
