import { trackSiteEvent } from "@/services/events";

export type AnalyticsEventType =
  | "page_view"
  | "form_submit"
  | "button_click"
  | "whatsapp_click"
  | "instagram_click"
  | "tiktok_click"
  | "program_view"
  | "service_click"
  | "payment_attempt"
  | "lead_capture"
  | "social_click";

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  page?: string;
  element?: string;
  metadata?: Record<string, string>;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = process.env.GA_MEASUREMENT_ID;

export function isGaConfigured(): boolean {
  return Boolean(GA_ID && !GA_ID.includes("G-XXXXXXXX"));
}

/** GA4 + optional Supabase site_events */
export function trackEvent(event: AnalyticsEvent): void {
  const page = event.page ?? (typeof window !== "undefined" ? window.location.pathname : "");
  const meta = {
    ...event.metadata,
    element: event.element ?? "",
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== "undefined" && isGaConfigured() && window.gtag) {
    window.gtag("event", event.eventType, {
      page_path: page,
      element: event.element,
      ...event.metadata,
    });
  }

  void trackSiteEvent({
    eventType: event.eventType,
    page,
    metadata: meta,
  });
}

export function trackPageView(path: string): void {
  trackEvent({ eventType: "page_view", page: path });
  if (typeof window !== "undefined" && isGaConfigured() && window.gtag) {
    window.gtag("config", GA_ID, { page_path: path });
  }
}
