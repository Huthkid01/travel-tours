"use client";

import { adminH1, adminSubtitle, adminTableHead, adminTableRow, adminTableWrap } from "@/lib/admin-ui";
import { formatCountryLabel } from "@/lib/visitor-geo";
import { Loader2, Trash2, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface VisitRow {
  id: string;
  action_type: string;
  source: string | null;
  session_id: string | null;
  country: string | null;
  created_at: string;
}

interface VisitSummary {
  totalVisits: number;
  visitsToday: number;
  activeUsers: number;
}

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [summary, setSummary] = useState<VisitSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/visits");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setSummary(data.summary ?? null);
      setVisits(Array.isArray(data.visits) ? data.visits : []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load visits");
      setVisits([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const refresh = window.setInterval(() => void load(), 30_000);
    return () => window.clearInterval(refresh);
  }, [load]);

  const clearAll = async () => {
    if (!confirm("Clear all visit data? This cannot be undone.")) return;
    setClearing(true);
    try {
      const res = await fetch("/api/admin/visits", { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Clear failed");
      toast.success("Visit data cleared");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Clear failed");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={adminH1}>Site Visits</h1>
          <p className={adminSubtitle}>
            Total visits count each time someone opens your site (one per browser session). Active now is
            only people on the site at this moment — when they leave or switch tabs, they drop off within
            about a minute.
          </p>
        </div>
        <button
          type="button"
          onClick={clearAll}
          disabled={clearing}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600/90 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
        >
          {clearing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Clear all visit data
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total site visits</p>
          <p className="mt-0.5 text-[11px] text-slate-400">Each time someone opens the site</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {summary?.totalVisits ?? (loading ? "—" : 0)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Visits today</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {summary?.visitsToday ?? (loading ? "—" : 0)}
          </p>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-5 dark:bg-green-950/20">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-green-700 dark:text-green-400">
            <Users className="h-3.5 w-3.5" />
            Active now
          </p>
          <p className="mt-2 text-3xl font-bold text-green-700 dark:text-green-400">
            {summary?.activeUsers ?? (loading ? "—" : 0)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Updates every 30 seconds while they stay</p>
        </div>
      </div>

      <p className="text-xs text-slate-500 sm:hidden">Swipe left on the table to see all columns.</p>
      <div className={adminTableWrap}>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className={adminTableHead}>
            <tr>
              <th className="whitespace-nowrap px-4 py-3">Time</th>
              <th className="whitespace-nowrap px-4 py-3">Type</th>
              <th className="min-w-[7rem] px-4 py-3">Country</th>
              <th className="min-w-[8rem] px-4 py-3">Landing page</th>
              <th className="min-w-[6rem] px-4 py-3">Session</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </td>
              </tr>
            )}
            {!loading && visits.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No site visits recorded yet.
                </td>
              </tr>
            )}
            {visits.map((row) => (
              <tr key={row.id} className={adminTableRow}>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300">
                    Site visit
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-300">
                  {formatCountryLabel(row.country)}
                </td>
                <td className="max-w-[14rem] px-4 py-3 text-slate-700 break-words dark:text-slate-300 sm:max-w-none">
                  {row.source || "/"}
                </td>
                <td className="max-w-[8rem] truncate px-4 py-3 font-mono text-xs text-slate-500">
                  {row.session_id ? row.session_id.slice(0, 8) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
