import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import { revalidatePublicSite } from "@/lib/revalidate-public-site";
import { seedAdminAnnouncementsFromLocal } from "@/services/admin-data";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    const count = await seedAdminAnnouncementsFromLocal();
    revalidatePublicSite();
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to import announcements" },
      { status: 500 }
    );
  }
}
