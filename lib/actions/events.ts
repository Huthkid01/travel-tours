"use server";

import { trackSiteEventServer, type SiteEventPayload } from "@/services/events.server";

export async function trackSiteEventAction(payload: SiteEventPayload): Promise<void> {
  await trackSiteEventServer(payload);
}
