import { getSupabaseClient } from "@/supabase/client";
import type { AnalyticsEventType } from "@/lib/analytics";

const DEMO_KEY = "daboi_site_events";

export interface SiteEventPayload {
  eventType: AnalyticsEventType | string;
  page: string;
  metadata?: Record<string, string>;
}

function saveDemoEvent(payload: SiteEventPayload): void {
  if (typeof window === "undefined") return;
  try {
    const list = JSON.parse(sessionStorage.getItem(DEMO_KEY) || "[]") as unknown[];
    list.push({ ...payload, created_at: new Date().toISOString() });
    sessionStorage.setItem(DEMO_KEY, JSON.stringify(list.slice(-200)));
  } catch {
    /* ignore */
  }
}

export async function trackSiteEvent(payload: SiteEventPayload): Promise<void> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    saveDemoEvent(payload);
    if (process.env.NODE_ENV === "development") {
      console.log("[site_events]", payload);
    }
    return;
  }

  await supabase.from("site_events").insert({
    event_type: payload.eventType,
    page: payload.page,
    metadata: payload.metadata ?? {},
  });
}
