"use client";

import { adminH1, adminTableHead, adminTableRow, adminTableWrap } from "@/lib/admin-ui";
import type { Application } from "@/types";
import { useEffect, useState } from "react";

export default function AdminApplicationsPage() {
  const [rows, setRows] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={adminH1}>Applications</h1>
      </div>

      <div className={adminTableWrap}>
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className={adminTableHead}>
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Payment</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No applications yet.
                </td>
              </tr>
            )}
            {rows.map((app) => (
              <tr key={app.id} className={adminTableRow}>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {new Date(app.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{app.full_name}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{app.service_name}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  <div>{app.email}</div>
                  <div className="text-xs">{app.phone}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      app.payment_status === "paid"
                        ? "text-green-600 dark:text-green-400"
                        : app.payment_status === "pending"
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-red-600 dark:text-red-400"
                    }
                  >
                    {app.payment_status}
                  </span>
                  {app.payment_reference && (
                    <div className="text-xs text-slate-500">{app.payment_reference}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
