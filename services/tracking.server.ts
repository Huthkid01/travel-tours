import "server-only";

import { shouldTrackVisit } from "@/lib/visit-tracking";
import { getServerSupabase } from "@/supabase/server";
import type { TrackActionPayload } from "@/services/tracking";

export async function trackVisitorActionServer(payload: TrackActionPayload): Promise<void> {
  if (!shouldTrackVisit({ source: payload.source, actionType: payload.actionType })) {
    return;
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    if (process.env.NODE_ENV === "development") {
      console.log("[LeadTracker]", payload);
    }
    return;
  }

  await supabase.from("visitor_activity").insert({
    action_type: payload.actionType,
    service: payload.service ?? null,
    source: payload.source ?? null,
    metadata: payload.metadata ?? {},
  });
}
