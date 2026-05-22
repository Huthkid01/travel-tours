"use server";

import { trackVisitorActionServer } from "@/services/tracking.server";
import type { TrackActionPayload } from "@/services/tracking";

export async function trackVisitorAction(payload: TrackActionPayload): Promise<void> {
  await trackVisitorActionServer(payload);
}
