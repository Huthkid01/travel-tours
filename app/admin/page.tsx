"use client";

import { StatCard } from "@/components/admin/StatCard";
import type { AdminDashboardStats } from "@/services/admin-data";
import {
  Bell,
  CreditCard,
  Eye,
  FileText,
  GraduationCap,
  RefreshCw,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const QUICK_ACTIONS = [
  { href: "/admin/programs", label: "Manage Programs", desc: "Edit travel programs on the site", icon: GraduationCap },
  { href: "/admin/announcements", label: "Announcements", desc: "Top bar messages & promos", icon: Bell },
  { href: "/admin/applications", label: "Applications", desc: "Form submissions from clients", icon: FileText },
  { href: "/admin/visits", label: "Site Visits", desc: "Page views and activity log", icon: Users },
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
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Content Management Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage programs, announcements, applications, and track site visits.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Site Visits"
          value={stats?.totalVisits ?? "—"}
          hint="All page views recorded"
          icon={Eye}
          accent="blue"
        />
        <StatCard
          label="Visits Today"
          value={stats?.visitsToday ?? "—"}
          hint="Page views since midnight"
          icon={Users}
          accent="green"
        />
        <StatCard
          label="Applications"
          value={stats?.totalApplications ?? "—"}
          hint={`${stats?.pendingPayments ?? 0} pending payment`}
          icon={FileText}
          accent="orange"
        />
        <StatCard
          label="Paid Applications"
          value={stats?.paidApplications ?? "—"}
          hint="Completed payments"
          icon={CreditCard}
          accent="purple"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Quick Actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {QUICK_ACTIONS.map(({ href, label, desc, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-4 transition hover:border-blue-500/40 hover:bg-slate-800"
              >
                <Icon className="h-8 w-8 shrink-0 text-blue-400" />
                <div>
                  <p className="font-medium text-slate-200">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Today&apos;s Summary</h2>
          <p className="mt-1 text-xs text-slate-500">
            {new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Active programs</span>
              <span className="font-semibold text-white">{stats?.activePrograms ?? 0}</span>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Active announcements</span>
              <span className="font-semibold text-white">{stats?.activeAnnouncements ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Services list</span>
              <span className="text-xs text-slate-500">Edit in code (data/services.ts)</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
