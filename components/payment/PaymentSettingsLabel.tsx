"use client";

import { usePaymentSettings } from "@/components/forms/usePaymentSettings";

/** Displays fee label from admin → Payment methods (live from API) */
export function PaymentSettingsFeeLabel({ prefix = "Fee" }: { prefix?: string }) {
  const { settings, loading } = usePaymentSettings();

  if (loading) {
    return <span className="text-navy-500">{prefix}: …</span>;
  }

  return (
    <span>
      {prefix}: <strong>{settings.feeAmountLabel}</strong>
    </span>
  );
}
