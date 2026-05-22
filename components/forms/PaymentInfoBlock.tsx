"use client";

import { DEFAULT_PAYMENT_SETTINGS, type PaymentSettings } from "@/data/payment-settings-default";
import { usePaymentSettings } from "@/components/forms/usePaymentSettings";

export function PaymentInfoBlock({ settings: settingsProp }: { settings?: PaymentSettings }) {
  const { settings: fetched, loading } = usePaymentSettings();
  const settings = settingsProp ?? (loading ? DEFAULT_PAYMENT_SETTINGS : fetched);

  if (!settings.showBankTransfer) return null;

  return (
    <div className="rounded-xl border border-gold-500/25 bg-gold-500/5 p-4 text-sm text-navy-800 dark:text-navy-200">
      <p className="font-semibold uppercase tracking-wide text-navy-900 dark:text-white">
        {settings.title}
      </p>
      <ul className="mt-3 space-y-1.5 leading-relaxed">
        <li>
          <span className="font-medium">Fee:</span> {settings.feeAmountLabel}
        </li>
        <li>
          <span className="font-medium">Bank:</span> {settings.bankName}
        </li>
        <li>
          <span className="font-medium">Account number:</span>{" "}
          <span className="font-mono text-gold-700 dark:text-gold-400">{settings.accountNumber}</span>
        </li>
        <li>
          <span className="font-medium">Account name:</span> {settings.accountName}
        </li>
      </ul>
      <p className="mt-3 text-xs text-navy-600 dark:text-navy-400">{settings.afterPaymentNote}</p>
    </div>
  );
}
