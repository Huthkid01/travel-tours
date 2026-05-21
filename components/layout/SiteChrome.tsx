"use client";

import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { FloatingSocials } from "@/components/social/FloatingSocials";

export function SiteChrome() {
  return (
    <>
      <AnalyticsTracker />
      <FloatingSocials />
    </>
  );
}
