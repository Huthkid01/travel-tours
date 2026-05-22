"use client";

import { AdminApplicationViewModal } from "@/components/admin/AdminApplicationViewModal";
import { sendContactViaFormSubmitClient } from "@/lib/formsubmit-client";
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
  const [emailHint, setEmailHint] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/test-email")
      .then((r) => r.json())
      .then((j: { hint?: string; gmailConfigured?: boolean }) => {
        setEmailHint(j.hint ?? null);
      })
      .catch(() => {});
  }, []);

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
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        hint?: string;
        to?: string;
        method?: string;
        tryBrowser?: boolean;
      };

      const client = await sendContactViaFormSubmitClient({
        name: "Darboi Admin (FormSubmit test)",
        email: json.to ?? "darboiconsults@gmail.com",
        phone: "—",
        subject: "FormSubmit test from admin",
        message: `Test at ${new Date().toISOString()}. If this is your first time, FormSubmit will email an activation link to ${json.to ?? "darboiconsults@gmail.com"}.`,
      });

      if (client.ok) {
        toast.success("FormSubmit accepted. Check darboiconsults@gmail.com inbox and spam.");
        toast.info(
          "First time? Click the activation link from FormSubmit. Then all contact and application forms will email you.",
          { duration: 12000 }
        );
        return;
      }

      throw new Error(
        client.message ||
          json.error ||
          "FormSubmit failed. Open the live site Contact page in Chrome and submit once to activate."
      );
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
            Submissions saved here. Owner email via FormSubmit from the visitor&apos;s browser.
          </p>
          {emailHint && <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">{emailHint}</p>}
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
