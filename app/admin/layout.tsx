import { AdminShell } from "@/components/admin/AdminShell";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";
import { cookies } from "next/headers";

export const metadata = {
  title: "Admin | Darboi Consults",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const email = verifyAdminSessionToken(token);

  if (!email) {
    return <>{children}</>;
  }

  return <AdminShell email={email}>{children}</AdminShell>;
}
