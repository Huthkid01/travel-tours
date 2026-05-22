import { trackVisitorAction as trackVisitorActionServer } from "@/lib/actions/tracking";
import type { VisitorActionType } from "@/types";

export interface TrackActionPayload {
  actionType: VisitorActionType;
  service?: string;
  source?: string;
  metadata?: Record<string, string>;
}

/** Client-safe wrapper — persists via server action */
export async function trackVisitorAction(payload: TrackActionPayload): Promise<void> {
  await trackVisitorActionServer(payload);
}
