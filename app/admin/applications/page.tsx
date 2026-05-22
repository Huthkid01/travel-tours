"use client";

import { AdminApplicationViewModal } from "@/components/admin/AdminApplicationViewModal";
import { adminH1, adminSubtitle, adminTableHead, adminTableRow, adminTableWrap } from "@/lib/admin-ui";
import { useConfirm } from "@/hooks/useConfirm";
import type { Application } from "@/types";
import { Eye, Loader2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminApplicationsPage() {
  const confirmDialog = useConfirm();
  const [rows, setRows] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Application | null>(null);
  const [clearing, setClearing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/applications");
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const clearAllForms = async () => {
    if (
      !(await confirmDialog({
        title: "Clear all form data",
        description:
          "Clear ALL form submissions? This deletes every application, lead popup entry, and contact message. Uploaded files may remain in storage. This cannot be undone.",
        confirmLabel: "Clear all",
        variant: "danger",
      }))
    ) {
      return;
    }
    setClearing(true);
    try {
      const res = await fetch("/api/admin/applications", { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Clear failed");
      toast.success(typeof json.message === "string" ? json.message : "Form data cleared");
      setViewing(null);
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not clear form data");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={adminH1}>Applications</h1>
          <p className={adminSubtitle}>
            Service applications, consultations, lead popup, and contact messages.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void clearAllForms()}
          disabled={clearing || loading}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600/90 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
        >
          {clearing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Clear all form data
        </button>
      </div>

      <p className="text-xs text-slate-500 sm:hidden">Swipe the table to see all columns.</p>
      <div className={adminTableWrap}>
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className={adminTableHead}>
            <tr>
              <th className="whitespace-nowrap px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Payment</th>
              <th className="whitespace-nowrap px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No applications yet.
                </td>
              </tr>
            )}
            {rows.map((app) => (
              <tr key={app.id} className={adminTableRow}>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                  {new Date(app.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{app.full_name}</td>
                <td className="max-w-[12rem] px-4 py-3 text-slate-700 break-words dark:text-slate-300">
                  {app.service_name}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  <div className="break-all">{app.email}</div>
                  <div className="text-xs">{app.phone}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      app.payment_status === "paid"
                        ? "font-medium text-green-600 dark:text-green-400"
                        : app.payment_status === "pending"
                          ? "font-medium text-orange-600 dark:text-orange-400"
                          : "font-medium text-red-600 dark:text-red-400"
                    }
                  >
                    {app.payment_status}
                  </span>
                  {app.payment_reference && (
                    <div className="text-xs text-slate-500">{app.payment_reference}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setViewing(app)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminApplicationViewModal application={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
