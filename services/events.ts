import { trackSiteEventAction } from "@/lib/actions/events";
import type { AnalyticsEventType } from "@/lib/analytics";

export interface SiteEventPayload {
  eventType: AnalyticsEventType | string;
  page: string;
  metadata?: Record<string, string>;
}

/** Client-safe wrapper — persists via server action */
export async function trackSiteEvent(payload: SiteEventPayload): Promise<void> {
  await trackSiteEventAction(payload);
}
