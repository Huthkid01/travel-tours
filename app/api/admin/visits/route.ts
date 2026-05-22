import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import {
  clearAdminPathVisitorActivity,
  clearAllVisitorActivity,
  fetchVisitDashboard,
} from "@/services/admin-data";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    return NextResponse.json(await fetchVisitDashboard());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load visits" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;

  const scope = new URL(request.url).searchParams.get("scope");

  try {
    if (scope === "admin-only") {
      await clearAdminPathVisitorActivity();
      return NextResponse.json({ ok: true, message: "Removed admin page visits only" });
    }
    await clearAllVisitorActivity();
    return NextResponse.json({ ok: true, message: "All visit data cleared" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to clear visits" },
      { status: 500 }
    );
  }
}
