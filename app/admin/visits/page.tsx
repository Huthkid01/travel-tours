"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("/api/admin/visits")
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const pageViews = rows.filter((r) => r.action_type === "page_view");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Site Visits</h1>
        <p className="mt-1 text-sm text-slate-400">
          Every time someone opens a page, it is saved in Supabase <code className="text-blue-400">visitor_activity</code>.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-950/80 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Page / Source</th>
              <th className="px-4 py-3">Service</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No activity yet. Visit the public site to generate page views.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-800/80 hover:bg-slate-800/30">
                <td className="px-4 py-3 text-slate-400">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      row.action_type === "page_view"
                        ? "rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300"
                        : "rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300"
                    }
                  >
                    {row.action_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{row.source || "—"}</td>
                <td className="px-4 py-3 text-slate-400">{row.service || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">
        Showing latest {rows.length} events ({pageViews.length} page views in this batch).
      </p>
    </div>
  );
}
