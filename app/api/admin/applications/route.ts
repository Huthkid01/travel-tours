import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import { fetchAdminApplications } from "@/services/admin-data";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    const data = await fetchAdminApplications();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load applications" },
      { status: 500 }
    );
  }
}
