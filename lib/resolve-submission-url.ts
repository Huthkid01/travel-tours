import "server-only";

import { getSiteUrl } from "@/lib/env.server";

/** Prefer the real page the visitor used, not server fallback (localhost on dev machines). */
export function resolveSubmissionUrl(
  request: Request,
  clientUrl?: string
): string {
  const candidates = [
    clientUrl,
    request.headers.get("origin") ?? undefined,
    request.headers.get("referer") ?? undefined,
  ];

  for (const raw of candidates) {
    if (!raw?.trim()) continue;
    try {
      const url = new URL(raw.trim());
      if (url.protocol !== "http:" && url.protocol !== "https:") continue;
      return url.origin;
    } catch {
      continue;
    }
  }

  const configured = getSiteUrl().replace(/\/$/, "");
  if (!configured.includes("localhost") && !configured.includes("127.0.0.1")) {
    return configured;
  }

  return "https://travel-tours-eight.vercel.app";
}
