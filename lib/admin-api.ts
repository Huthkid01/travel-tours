import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function requireAdminSession(): Promise<string | NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const email = verifyAdminSessionToken(token);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return email;
}

export function isAdminResponse(value: string | NextResponse): value is NextResponse {
  return value instanceof NextResponse;
}
