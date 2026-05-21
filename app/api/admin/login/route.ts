import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminCredentials,
  verifyAdminLogin,
} from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const creds = getAdminCredentials();
  if (!creds) {
    return NextResponse.json(
      { error: "Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env" },
      { status: 503 }
    );
  }

  const body = (await request.json()) as { email?: string; password?: string };
  if (!body.email || !body.password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  if (!verifyAdminLogin(body.email, body.password)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = createAdminSessionToken(body.email.trim().toLowerCase());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}
