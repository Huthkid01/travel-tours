"use client";

import { StatCard } from "@/components/admin/StatCard";
import { adminBtnSecondary, adminH1, adminSubtitle } from "@/lib/admin-ui";
import type { AdminDashboardStats } from "@/services/admin-data";
import {
  Bell,
  Briefcase,
  CreditCard,
  Eye,
  FileText,
  GraduationCap,
  MessageSquareQuote,
  RefreshCw,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const CONTENT_LINKS = [
  { href: "/admin/services", label: "Manage Services", desc: "Edit all services on the site", icon: Briefcase },
  { href: "/admin/programs", label: "Manage Programs", desc: "Travel programs & flyers", icon: GraduationCap },
  { href: "/admin/announcements", label: "Announcements", desc: "Top banner messages", icon: Bell },
  { href: "/admin/testimonials", label: "Testimonials", desc: "Client reviews on homepage", icon: MessageSquareQuote },
];

const ACTIVITY_LINKS = [
  { href: "/admin/visits", label: "Site visits", desc: "Total opens and who is on site now", icon: Users },
  { href: "/admin/applications", label: "Applications", desc: "Client form submissions", icon: FileText },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) setStats(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={adminH1}>Dashboard overview</h1>
          <p className={adminSubtitle}>
            Site visits, form submissions, services, and quick links to edit your website.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className={adminBtnSecondary}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total site visits"
          value={stats?.totalVisits ?? "—"}
          hint={`${stats?.visitsToday ?? 0} opened today · ${stats?.activeUsers ?? 0} on site now`}
          icon={Eye}
          accent="blue"
        />
        <StatCard
          label="Total services"
          value={stats?.totalServices ?? "—"}
          hint={`${stats?.activeServices ?? 0} active on site`}
          icon={Briefcase}
          accent="green"
        />
        <StatCard
          label="Total forms submitted"
          value={stats?.totalFormsSubmitted ?? "—"}
          hint={`${stats?.formsSubmittedToday ?? 0} today · ${stats?.totalApplications ?? 0} applications`}
          icon={FileText}
          accent="orange"
        />
        <StatCard
          label="Paid applications"
          value={stats?.paidApplications ?? "—"}
          hint="Completed payments"
          icon={CreditCard}
          accent="purple"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Website content</h2>
          <p className="mt-1 text-xs text-slate-500">Edit what visitors see on the public site</p>
          <div className="mt-4 grid gap-3">
            {CONTENT_LINKS.map(({ href, label, desc, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-500/40 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-800"
              >
                <Icon className="h-8 w-8 shrink-0 text-blue-500 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-900 dark:text-white">Activity</h2>
          <p className="mt-1 text-xs text-slate-500">Visits and client submissions</p>
          <div className="mt-4 grid gap-3">
            {ACTIVITY_LINKS.map(({ href, label, desc, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-500/40 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-800"
              >
                <Icon className="h-8 w-8 shrink-0 text-blue-500 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <ul className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
            <li className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Service applications</span>
              <span className="font-semibold text-slate-900 dark:text-white">{stats?.totalApplications ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Lead popup submissions</span>
              <span className="font-semibold text-slate-900 dark:text-white">{stats?.totalLeads ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Contact page messages</span>
              <span className="font-semibold text-slate-900 dark:text-white">{stats?.totalContactMessages ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Pending payment</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">{stats?.pendingPayments ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Active programs</span>
              <span className="font-semibold text-slate-900 dark:text-white">{stats?.activePrograms ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Active announcements</span>
              <span className="font-semibold text-slate-900 dark:text-white">{stats?.activeAnnouncements ?? 0}</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
