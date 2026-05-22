import { enrichVisitMetadata } from "@/lib/visit-track-enrich";
import { shouldTrackVisit } from "@/lib/visit-tracking";
import { trackVisitorActionServer } from "@/services/tracking.server";
import type { VisitorActionType } from "@/types";
import { NextResponse } from "next/server";

const PUBLIC_VISIT_ACTIONS = new Set<VisitorActionType>([
  "site_visit",
  "active_ping",
  "session_end",
]);

export async function POST(request: Request) {
  let body: {
    actionType?: VisitorActionType;
    source?: string;
    metadata?: Record<string, string>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const actionType = body.actionType;
  if (!actionType || !PUBLIC_VISIT_ACTIONS.has(actionType)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  if (!shouldTrackVisit({ source: body.source, actionType })) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const metadata = await enrichVisitMetadata(body.metadata);

  await trackVisitorActionServer({
    actionType,
    source: body.source,
    metadata,
  });

  return NextResponse.json({ ok: true });
}
