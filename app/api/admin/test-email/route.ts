import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import { NextResponse } from "next/server";

/** Legacy route — owner email is sent from the public site forms, not from admin. */
export async function POST() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  return NextResponse.json({ ok: false, error: "Not available" }, { status: 410 });
}

export async function GET() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  return NextResponse.json({ ok: true });
}
