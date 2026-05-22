"use client";

import { AdminApplicationViewModal } from "@/components/admin/AdminApplicationViewModal";
import { adminBtnSecondary, adminH1, adminSubtitle, adminTableHead, adminTableRow, adminTableWrap } from "@/lib/admin-ui";
import type { Application } from "@/types";
import { Eye, Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminApplicationsPage() {
  const [rows, setRows] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingEmail, setTestingEmail] = useState(false);
  const [viewing, setViewing] = useState<Application | null>(null);

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const testOwnerEmail = async () => {
    setTestingEmail(true);
    try {
      const res = await fetch("/api/admin/test-email", { method: "POST" });
      const json = (await res.json()) as { ok?: boolean; error?: string; hint?: string; to?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Test failed");
      }
      toast.success(`Test email sent to ${json.to ?? "owner inbox"}. Check inbox and spam.`);
      if (json.hint) toast.info(json.hint, { duration: 8000 });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not send test email");
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={adminH1}>Applications</h1>
          <p className={adminSubtitle}>
            Submissions are saved here. Owner also gets email via FormSubmit (or Gmail if configured).
          </p>
        </div>
        <button
          type="button"
          onClick={() => void testOwnerEmail()}
          disabled={testingEmail}
          className={adminBtnSecondary}
        >
          {testingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Test owner email
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
