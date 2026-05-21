import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import { fetchAdminStats } from "@/services/admin-data";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    const stats = await fetchAdminStats();
    return NextResponse.json(stats);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load stats" },
      { status: 500 }
    );
  }
}
