/** How often the browser sends “still here” while the tab is visible */
export const VISIT_PING_INTERVAL_MS = 30_000;

/** Must have a ping newer than this to count as “on site now” */
export const ACTIVE_USER_WINDOW_MS = 45_000;

export type VisitActivityRow = {
  action_type: string;
  metadata: unknown;
  created_at: string;
};

/**
 * Sessions with a recent ping that have not sent session_end after that ping.
 * Hidden/closed tabs stop pinging and usually send session_end.
 */
export function countCurrentlyActiveUsers(
  rows: VisitActivityRow[],
  now = Date.now()
): number {
  const windowStart = now - ACTIVE_USER_WINDOW_MS;
  const latestPingBySession = new Map<string, number>();
  const latestEndBySession = new Map<string, number>();

  for (const row of rows) {
    const meta = row.metadata as { sessionId?: string } | null;
    const sid = meta?.sessionId;
    if (!sid) continue;
    const t = new Date(row.created_at).getTime();
    if (t < windowStart) continue;

    if (row.action_type === "active_ping") {
      latestPingBySession.set(sid, Math.max(latestPingBySession.get(sid) ?? 0, t));
    } else if (row.action_type === "session_end") {
      latestEndBySession.set(sid, Math.max(latestEndBySession.get(sid) ?? 0, t));
    }
  }

  let count = 0;
  for (const [sid, pingTime] of latestPingBySession) {
    const endTime = latestEndBySession.get(sid);
    if (endTime != null && endTime >= pingTime) continue;
    count++;
  }
  return count;
}
