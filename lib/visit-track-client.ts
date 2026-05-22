import type { TrackActionPayload } from "@/services/tracking";

/** Reliable send when the tab closes or hides (server actions may not finish). */
export function beaconVisitTrack(payload: TrackActionPayload): void {
  if (typeof window === "undefined") return;
  const body = JSON.stringify(payload);
  const blob = new Blob([body], { type: "application/json" });
  if (navigator.sendBeacon("/api/visit-track", blob)) return;
  void fetch("/api/visit-track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}
