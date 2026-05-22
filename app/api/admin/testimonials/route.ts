import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import { revalidatePublicSite } from "@/lib/revalidate-public-site";
import {
  deleteAdminTestimonial,
  fetchAdminTestimonials,
  upsertAdminTestimonial,
} from "@/services/admin-data";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    return NextResponse.json(await fetchAdminTestimonials());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    const body = await request.json();
    await upsertAdminTestimonial(body, body.id);
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save testimonial" },
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
    await deleteAdminTestimonial(id);
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete" },
      { status: 500 }
    );
  }
}
