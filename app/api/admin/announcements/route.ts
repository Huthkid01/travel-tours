import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import {
  deleteAdminAnnouncement,
  fetchAdminAnnouncements,
  upsertAdminAnnouncement,
} from "@/services/admin-data";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    return NextResponse.json(await fetchAdminAnnouncements());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load announcements" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    const body = await request.json();
    await upsertAdminAnnouncement(body, body.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save announcement" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  try {
    await deleteAdminAnnouncement(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete" },
      { status: 500 }
    );
  }
}
