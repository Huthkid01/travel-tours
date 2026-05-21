import { getSupabaseClient } from "@/supabase/client";
import type { VisitorActionType } from "@/types";

const DEMO_KEY = "daboi_visitor_activity";

export interface TrackActionPayload {
  actionType: VisitorActionType;
  service?: string;
  source?: string;
  metadata?: Record<string, string>;
}

function saveDemoActivity(payload: TrackActionPayload): void {
  if (typeof window === "undefined") return;
  try {
    const list = JSON.parse(sessionStorage.getItem(DEMO_KEY) || "[]") as unknown[];
    list.push({ ...payload, created_at: new Date().toISOString() });
    sessionStorage.setItem(DEMO_KEY, JSON.stringify(list.slice(-100)));
  } catch {
    /* ignore */
  }
}

export async function trackVisitorAction(payload: TrackActionPayload): Promise<void> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    saveDemoActivity(payload);
    if (process.env.NODE_ENV === "development") {
      console.log("[LeadTracker]", payload);
    }
    return;
  }

  await supabase.from("visitor_activity").insert({
    action_type: payload.actionType,
    service: payload.service ?? null,
    source: payload.source ?? (typeof window !== "undefined" ? window.location.pathname : null),
    metadata: payload.metadata ?? {},
  });
}
