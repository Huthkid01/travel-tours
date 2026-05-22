import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import { revalidatePublicSite } from "@/lib/revalidate-public-site";
import { deleteAdminProgram, fetchAdminPrograms, upsertAdminProgram } from "@/services/admin-data";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    return NextResponse.json(await fetchAdminPrograms());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load programs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    const body = await request.json();
    const data = await upsertAdminProgram(body, body.id);
    revalidatePublicSite();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save program" },
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
    await deleteAdminProgram(id);
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete" },
      { status: 500 }
    );
  }
}
