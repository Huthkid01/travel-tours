"use client";

import { DEFAULT_PAYMENT_SETTINGS, type PaymentSettings } from "@/data/payment-settings-default";
import { useLiveCms } from "@/hooks/use-live-cms";

/** Poll interval — admin changes in Payment methods appear on the site without refresh */
const PAYMENT_SETTINGS_POLL_MS = 15_000;

export function usePaymentSettings() {
  const { data, loading, refresh } = useLiveCms<PaymentSettings>("/api/payment-settings", {
    initial: DEFAULT_PAYMENT_SETTINGS,
    enabled: true,
    pollMs: PAYMENT_SETTINGS_POLL_MS,
  });

  return {
    settings: data ?? DEFAULT_PAYMENT_SETTINGS,
    loading,
    refresh,
  };
}
