import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token || token.length < 20) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
