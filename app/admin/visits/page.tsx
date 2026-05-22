"use client";

import { adminH1, adminSubtitle, adminTableHead, adminTableRow, adminTableWrap } from "@/lib/admin-ui";
import { Loader2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface VisitRow {
  id: string;
  action_type: string;
  source: string | null;
  service: string | null;
  created_at: string;
}

export default function AdminVisitsPage() {
  const [rows, setRows] = useState<VisitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/visits");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load visits");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const clearAll = async () => {
    if (
      !confirm(
        "Clear ALL visit data? This removes every row in visitor_activity so you can monitor fresh public traffic only."
      )
    ) {
      return;
    }
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

  const pageViews = rows.filter((r) => r.action_type === "page_view");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={adminH1}>Site Visits</h1>
          <p className={adminSubtitle}>Page views and actions on the live website.</p>
        </div>
        <div className="flex flex-wrap gap-2">
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
      </div>

      <p className="text-xs text-slate-500 sm:hidden">Swipe left on the table to see all columns.</p>
      <div className={adminTableWrap}>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className={adminTableHead}>
            <tr>
              <th className="whitespace-nowrap px-4 py-3">Time</th>
              <th className="whitespace-nowrap px-4 py-3">Action</th>
              <th className="min-w-[8rem] px-4 py-3">Page / Source</th>
              <th className="min-w-[6rem] px-4 py-3">Service</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No visits recorded yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className={adminTableRow}>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={
                      row.action_type === "page_view"
                        ? "rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300"
                        : "rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300"
                    }
                  >
                    {row.action_type}
                  </span>
                </td>
                <td className="max-w-[14rem] px-4 py-3 text-slate-700 break-words dark:text-slate-300 sm:max-w-none">
                  {row.source || "—"}
                </td>
                <td className="max-w-[10rem] px-4 py-3 text-slate-600 break-words dark:text-slate-400 sm:max-w-none">
                  {row.service || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">
        Showing latest {rows.length} public events ({pageViews.length} page views in this list).
      </p>
    </div>
  );
}
