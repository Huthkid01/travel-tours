import { AdminShell } from "@/components/admin/AdminShell";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin | Darboi Consults",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isLoginRoute = pathname.startsWith("/admin/login");

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const email = verifyAdminSessionToken(token);

  if (!email && !isLoginRoute) {
    redirect("/admin/login");
  }

  if (!email || isLoginRoute) {
    return <>{children}</>;
  }

  return <AdminShell email={email}>{children}</AdminShell>;
}
