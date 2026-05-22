/** Browser session id for visit + active-user tracking (one site visit per tab session) */
const SESSION_KEY = "darboi_visit_session";
const VISIT_RECORDED_KEY = "darboi_visit_recorded";

export function getOrCreateVisitSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function hasRecordedSiteVisit(): boolean {
  if (typeof window === "undefined") return true;
  return sessionStorage.getItem(VISIT_RECORDED_KEY) === "1";
}

export function markSiteVisitRecorded(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(VISIT_RECORDED_KEY, "1");
}
