import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { verifyAdminSessionTokenEdge } from "@/lib/admin-auth-edge";
import { NextResponse, type NextRequest } from "next/server";

function withPathname(request: NextRequest, pathname: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  if (pathname.startsWith("/admin/login")) {
    return withPathname(request, pathname);
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifyAdminSessionTokenEdge(token);

  if (!valid) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return withPathname(request, pathname);
}

export const config = {
  matcher: ["/admin/:path*"],
};
