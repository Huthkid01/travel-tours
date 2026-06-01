"use client";

import {
  DEFAULT_PAYMENT_SETTINGS,
  type PaymentSettings,
} from "@/data/payment-settings-default";
import { useConfirm } from "@/hooks/useConfirm";
import { cn } from "@/lib/utils";
import {
  Building2,
  Eye,
  Loader2,
  RotateCcw,
  Save,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600";
const labelClass = "text-xs font-medium uppercase tracking-wide text-slate-500";

function ToggleRow({
  checked,
  onChange,
  title,
  description,
  icon: Icon,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex min-w-0 gap-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">{title}</p>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-blue-600" : "bg-slate-700"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/15 text-blue-600 dark:text-blue-400">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

export default function AdminPaymentPage() {
  const confirmDialog = useConfirm();
  const [form, setForm] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payment-settings");
      const data = await res.json();
      if (res.ok && data && !data.error) {
        setForm(data as PaymentSettings);
      }
    } catch {
      toast.error("Failed to load payment settings");
    } finally {
      setLoading(false);
    }
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
        body: JSON.stringify({
          ...form,
          paystackEnabled: false,
          flutterwaveEnabled: false,
        }),
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

  const resetDefaults = async () => {
    if (
      !(await confirmDialog({
        title: "Reset payment settings",
        description: "Reset form to site defaults? You still need to click Save.",
        confirmLabel: "Reset",
        variant: "danger",
      }))
    ) {
      return;
    }
    setForm(DEFAULT_PAYMENT_SETTINGS);
  };

  const formatFee = () => {
    if (form.feeAmountLabel?.trim()) return form.feeAmountLabel;
    if (form.feeAmount > 0) {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(form.feeAmount);
    }
    return "—";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Payment methods</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Changes here update the bank transfer popup on application forms (consultation, services,
            programs). Visitors see updates within about 15 seconds, or immediately when they open the
            payment step after you save.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetDefaults}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset defaults
          </button>
          <button
            type="button"
            onClick={save}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-16 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading payment settings…
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <SectionCard
              title="Bank transfer"
              description="Same content as the live payment popup on the website (preview on the right)."
              icon={Building2}
            >
              <ToggleRow
                checked={form.showBankTransfer}
                onChange={(v) => setForm({ ...form, showBankTransfer: v })}
                title="Show bank transfer on forms"
                description="When off, clients only see enabled online gateways."
                icon={Wallet}
              />

              <label className="block">
                <span className={labelClass}>Section title</span>
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Appointment fees for procurement"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Fee amount (number)</span>
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={form.feeAmount}
                    onChange={(e) => setForm({ ...form, feeAmount: Number(e.target.value) || 0 })}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Fee label (display)</span>
                  <input
                    className={inputClass}
                    value={form.feeAmountLabel}
                    onChange={(e) => setForm({ ...form, feeAmountLabel: e.target.value })}
                    placeholder="₦35,000"
                  />
                </label>
              </div>

              <label className="block">
                <span className={labelClass}>Bank name</span>
                <input
                  className={inputClass}
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  placeholder="GTBank"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Account number</span>
                  <input
                    className={inputClass}
                    value={form.accountNumber}
                    onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                    placeholder="0123456789"
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Account name</span>
                  <input
                    className={inputClass}
                    value={form.accountName}
                    onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                    placeholder="Darboi Consults Ltd"
                  />
                </label>
              </div>

              <label className="block">
                <span className={labelClass}>Note after bank details</span>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={form.afterPaymentNote}
                  onChange={(e) => setForm({ ...form, afterPaymentNote: e.target.value })}
                  placeholder="Instructions after the client copies bank details…"
                />
              </label>
            </SectionCard>
          </div>

          <aside className="space-y-4">
            <div className="sticky top-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950/50 px-4 py-3">
                <Eye className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-semibold text-white">Payment popup preview</span>
              </div>
              <div className="space-y-4 p-4">
                {!form.showBankTransfer ? (
                  <p className="text-sm text-slate-500">Bank transfer is hidden on forms.</p>
                ) : (
                  <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm">
                    <p className="font-semibold text-white">{form.title || "Bank transfer"}</p>
                    <p className="mt-2 text-lg font-bold text-blue-400">{formatFee()}</p>
                    <dl className="mt-4 space-y-2 text-slate-300">
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-slate-500">Bank</dt>
                        <dd>{form.bankName || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-slate-500">
                          Account number
                        </dt>
                        <dd className="font-mono text-white">{form.accountNumber || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-slate-500">
                          Account name
                        </dt>
                        <dd>{form.accountName || "—"}</dd>
                      </div>
                    </dl>
                    {form.afterPaymentNote?.trim() && (
                      <p className="mt-4 border-t border-slate-800 pt-3 text-xs text-slate-500">
                        {form.afterPaymentNote}
                      </p>
                    )}
                  </div>
                )}

                <p className="text-xs text-slate-500">
                  Click <strong className="text-slate-400">Save changes</strong> to push this to the live
                  site. The preview matches what clients see in the payment popup.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
