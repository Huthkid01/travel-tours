"use server";

import { enrichVisitMetadata } from "@/lib/visit-track-enrich";
import { trackVisitorActionServer } from "@/services/tracking.server";
import type { TrackActionPayload } from "@/services/tracking";

export async function trackVisitorAction(payload: TrackActionPayload): Promise<void> {
  const metadata = await enrichVisitMetadata(payload.metadata);
  await trackVisitorActionServer({ ...payload, metadata });
}
