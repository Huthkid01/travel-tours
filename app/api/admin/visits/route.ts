import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import { fetchRecentVisits } from "@/services/admin-data";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    return NextResponse.json(await fetchRecentVisits(50));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load visits" },
      { status: 500 }
    );
  }
}
