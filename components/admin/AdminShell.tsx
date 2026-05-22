"use client";

import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Bell,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ExternalLink,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const SIDEBAR_COLLAPSED_KEY = "admin-sidebar-collapsed";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-[width,transform] duration-200 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0",
          collapsed ? "w-64 lg:w-[4.5rem]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div
          className={cn(
            "flex items-start gap-2 border-b border-slate-200 dark:border-slate-800",
            collapsed ? "justify-center p-3" : "justify-between p-4"
          )}
        >
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-wider text-gold-400 uppercase">Admin Panel</p>
              <p className="mt-1 font-display text-lg font-bold leading-tight">{BRAND.short}</p>
            </div>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              "shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
            title={collapsed ? "Open sidebar" : "Close sidebar"}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {!collapsed && (
          <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <p className="text-xs text-slate-500">Logged in as</p>
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{email}</p>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-3">
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? label : undefined}
                    className={cn(
                      "flex items-center rounded-lg py-2.5 text-sm font-medium transition",
                      collapsed ? "justify-center px-2" : "gap-3 px-3",
                      isActive(href)
                        ? "bg-blue-600/20 text-blue-300"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div
          className={cn(
            "border-t border-slate-200 p-2 dark:border-slate-800",
            collapsed && "flex flex-col items-center gap-1"
          )}
        >
          <Link
            href="/"
            target="_blank"
            title="View live site"
            className={cn(
              "rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
              collapsed
                ? "flex h-10 w-10 items-center justify-center"
                : "mb-2 block px-3 py-2 text-sm"
            )}
          >
            {collapsed ? <ExternalLink className="h-4 w-4" /> : "View live site →"}
          </Link>
          <button
            type="button"
            onClick={logout}
            title="Log out"
            className={cn(
              "flex items-center rounded-lg text-sm text-red-400 hover:bg-red-500/10",
              collapsed ? "h-10 w-10 justify-center" : "w-full gap-2 px-3 py-2"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Log out"}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 lg:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <p className="text-sm text-slate-600 dark:text-slate-500 lg:hidden">Admin</p>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">Darboi Consults CMS</span>
            <AdminThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-slate-100 p-4 dark:bg-slate-950 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
