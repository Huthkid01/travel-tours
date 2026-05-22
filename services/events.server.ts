import "server-only";

import { getServerSupabase } from "@/supabase/server";

export interface SiteEventPayload {
  eventType: string;
  page: string;
  metadata?: Record<string, string>;
}

export async function trackSiteEventServer(payload: SiteEventPayload): Promise<void> {
  const supabase = getServerSupabase();
  if (!supabase) return;

  await supabase.from("site_events").insert({
    event_type: payload.eventType,
    page: payload.page,
    metadata: payload.metadata ?? {},
  });
}
