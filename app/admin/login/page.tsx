import { LoginForm } from "@/app/admin/login/LoginForm";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

function loginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] text-navy-500 dark:bg-navy-950">
      Loading…
    </div>
  );
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const email = verifyAdminSessionToken(token);

  if (email) {
    const dest =
      next?.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin";
    redirect(dest);
  }

  return (
    <Suspense fallback={loginFallback()}>
      <LoginForm />
    </Suspense>
  );
}
