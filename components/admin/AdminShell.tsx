"use client";

import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Bell,
  Briefcase,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Website content",
    items: [
      { href: "/admin/services", label: "Services", icon: Briefcase },
      { href: "/admin/programs", label: "Programs", icon: GraduationCap },
      { href: "/admin/announcements", label: "Announcements", icon: Bell },
      { href: "/admin/payment", label: "Payment methods", icon: CreditCard },
    ],
  },
  {
    title: "Activity",
    items: [
      { href: "/admin/visits", label: "Site visits", icon: Users },
      { href: "/admin/applications", label: "Applications", icon: FileText },
    ],
  },
] as const;

export function AdminShell({ children, email }: { children: ReactNode; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-900 transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-slate-800 p-5">
          <p className="text-xs font-semibold tracking-wider text-gold-400 uppercase">Admin Panel</p>
          <p className="mt-1 font-display text-lg font-bold">{BRAND.short}</p>
        </div>
        <div className="border-b border-slate-800 px-4 py-3">
          <p className="text-xs text-slate-500">Logged in as</p>
          <p className="truncate text-sm font-medium text-slate-200">{email}</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-4">
              <p className="mb-2 px-3 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                      isActive(href)
                        ? "bg-blue-600/20 text-blue-300"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-3">
          <Link
            href="/"
            target="_blank"
            className="mb-2 block rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            View live site →
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 lg:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <p className="text-sm text-slate-500 lg:hidden">Admin</p>
          <div className="ml-auto text-xs text-slate-500">Darboi Consults CMS</div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
