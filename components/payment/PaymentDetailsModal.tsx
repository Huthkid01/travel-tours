"use client";

import { usePaymentSettings } from "@/components/forms/usePaymentSettings";
import { DEFAULT_PAYMENT_SETTINGS, type PaymentSettings } from "@/data/payment-settings-default";
import { formInputClass, formLabelClass } from "@/components/forms/form-step-styles";
import { cn } from "@/lib/utils";
import { Check, Copy, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface PaymentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onDone: (paymentReference: string) => void;
  settings?: PaymentSettings;
  loadingDone?: boolean;
  loadingLabel?: string;
  /** Shown under bank details while application uploads in background */
  statusHint?: string;
  doneLabel?: string;
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — select and copy manually");
    }
  }, [label, value]);

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-navy-100 bg-navy-50/80 px-3 py-2.5 dark:border-navy-700 dark:bg-navy-950/50">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-navy-500 dark:text-navy-400">{label}</p>
        <p className="mt-0.5 break-all font-mono text-sm font-semibold text-navy-900 dark:text-white">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-lg border border-gold-500/40 bg-gold-500/10 p-2 text-gold-700 hover:bg-gold-500/20 dark:text-gold-400"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function PaymentDetailsModal({
  open,
  onClose,
  onDone,
  settings: settingsProp,
  loadingDone = false,
  loadingLabel = "Confirming payment…",
  statusHint,
  doneLabel = "I've made payment — Open WhatsApp",
}: PaymentDetailsModalProps) {
  const { settings: fetched, loading } = usePaymentSettings();
  const settings = settingsProp ?? (loading ? DEFAULT_PAYMENT_SETTINGS : fetched);
  const [paymentReference, setPaymentReference] = useState("");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[350] flex items-end justify-center bg-black/60 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-navy-200 bg-white shadow-2xl dark:border-navy-700 dark:bg-navy-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4 dark:border-navy-800">
          <div>
            <h2 id="payment-modal-title" className="font-display text-lg font-bold text-navy-900 dark:text-white">
              Bank transfer details
            </h2>
            <p className="mt-0.5 text-sm text-navy-600 dark:text-navy-400">
              Copy the details below, make your transfer, then tap Done
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-navy-500 hover:bg-navy-100 dark:hover:bg-navy-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-700 dark:text-gold-400">
              Amount to pay
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-navy-900 dark:text-white">
              {settings.feeAmountLabel}
            </p>
          </div>
          <p className="text-sm font-semibold text-navy-900 dark:text-white">{settings.title}</p>
          <CopyRow label="Bank" value={settings.bankName} />
          <CopyRow label="Account number" value={settings.accountNumber} />
          <CopyRow label="Account name" value={settings.accountName} />

          {statusHint && (
            <p className="rounded-lg border border-gold-500/25 bg-gold-500/10 px-3 py-2 text-xs text-navy-700 dark:text-navy-200">
              {statusHint}
            </p>
          )}

          <div className="pt-2">
            <label className={formLabelClass}>Payment reference / depositor name</label>
            <p className="mb-2 text-xs text-navy-500">After you transfer, enter the reference or name used</p>
            <input
              className={formInputClass}
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="Transfer reference or depositor name"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-navy-100 p-5 dark:border-navy-800 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-navy-200 px-5 py-2.5 text-sm font-medium text-navy-700 dark:border-navy-600 dark:text-navy-200"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loadingDone}
            onClick={() => onDone(paymentReference.trim())}
            className={cn(
              "rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-navy-950 hover:bg-gold-400 disabled:opacity-60"
            )}
          >
            {loadingDone ? loadingLabel : doneLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
