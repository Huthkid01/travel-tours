/** Paths that must not be counted as public site visits */
export function isExcludedVisitPath(path: string | null | undefined): boolean {
  if (!path) return false;
  const p = path.split("?")[0] ?? path;
  return p === "/admin" || p.startsWith("/admin/");
}

export function shouldTrackVisit(payload: { source?: string | null; actionType?: string }): boolean {
  return !isExcludedVisitPath(payload.source ?? null);
}
