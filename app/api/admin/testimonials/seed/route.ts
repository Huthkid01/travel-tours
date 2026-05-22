import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import { revalidatePublicSite } from "@/lib/revalidate-public-site";
import { seedAdminTestimonialsFromLocal } from "@/services/admin-data";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    const count = await seedAdminTestimonialsFromLocal();
    revalidatePublicSite();
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Import failed" },
      { status: 500 }
    );
  }
}
