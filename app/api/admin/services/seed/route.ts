import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import { seedAdminServicesFromLocal } from "@/services/admin-data";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    const count = await seedAdminServicesFromLocal();
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to import services" },
      { status: 500 }
    );
  }
}
