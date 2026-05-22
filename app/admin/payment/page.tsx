"use client";

import {
  DEFAULT_PAYMENT_SETTINGS,
  type PaymentSettings,
} from "@/data/payment-settings-default";
import { Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-600";

export default function AdminPaymentPage() {
  const [form, setForm] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/payment-settings");
    const data = await res.json();
    if (res.ok && data && !data.error) {
      setForm(data as PaymentSettings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!form.bankName.trim() || !form.accountNumber.trim()) {
      toast.error("Bank name and account number are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/payment-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      toast.success("Payment settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = () => {
    if (!confirm("Reset form to site defaults? (You still need to click Save.)")) return;
    setForm(DEFAULT_PAYMENT_SETTINGS);
  };

  if (loading) {
    return <p className="text-slate-500">Loading payment settings…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Payment methods</h1>
        <p className="mt-1 text-sm text-slate-400">
          Bank transfer details shown on application forms and which online gateways appear at checkout.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-sm font-semibold text-slate-300">Bank transfer block</h2>

        <label className="block space-y-1">
          <span className="text-xs text-slate-500">Section title</span>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-xs text-slate-500">Fee amount (number)</span>
            <input
              type="number"
              className={inputClass}
              value={form.feeAmount}
              onChange={(e) => setForm({ ...form, feeAmount: Number(e.target.value) || 0 })}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-slate-500">Fee label (display)</span>
            <input
              className={inputClass}
              value={form.feeAmountLabel}
              onChange={(e) => setForm({ ...form, feeAmountLabel: e.target.value })}
            />
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-xs text-slate-500">Bank name</span>
          <input
            className={inputClass}
            value={form.bankName}
            onChange={(e) => setForm({ ...form, bankName: e.target.value })}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs text-slate-500">Account number</span>
          <input
            className={inputClass}
            value={form.accountNumber}
            onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs text-slate-500">Account name</span>
          <input
            className={inputClass}
            value={form.accountName}
            onChange={(e) => setForm({ ...form, accountName: e.target.value })}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs text-slate-500">Note after bank details</span>
          <textarea
            rows={2}
            className={inputClass}
            value={form.afterPaymentNote}
            onChange={(e) => setForm({ ...form, afterPaymentNote: e.target.value })}
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.showBankTransfer}
            onChange={(e) => setForm({ ...form, showBankTransfer: e.target.checked })}
          />
          Show bank transfer block on forms
        </label>
      </div>

      <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-sm font-semibold text-slate-300">Online payment gateways</h2>
        <p className="text-xs text-slate-500">
          Public keys in Vercel env (<code className="text-slate-400">PAYSTACK_PUBLIC_KEY</code>,{" "}
          <code className="text-slate-400">FLUTTERWAVE_PUBLIC_KEY</code>) — server-only, not exposed in build. Toggles here show or hide each gateway.
        </p>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.paystackEnabled}
            onChange={(e) => setForm({ ...form, paystackEnabled: e.target.checked })}
          />
          Enable Paystack
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.flutterwaveEnabled}
            onChange={(e) => setForm({ ...form, flutterwaveEnabled: e.target.checked })}
          />
          Enable Flutterwave
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
        <button
          type="button"
          onClick={resetDefaults}
          className="rounded-lg border border-slate-600 px-4 py-2.5 text-sm text-slate-400 hover:text-white"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
