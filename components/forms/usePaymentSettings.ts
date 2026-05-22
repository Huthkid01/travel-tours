"use client";

import { DEFAULT_PAYMENT_SETTINGS, type PaymentSettings } from "@/data/payment-settings-default";
import { useLiveCms } from "@/hooks/use-live-cms";

export function usePaymentSettings() {
  const { data, loading } = useLiveCms<PaymentSettings>("/api/payment-settings", {
    initial: DEFAULT_PAYMENT_SETTINGS,
  });

  return {
    settings: data ?? DEFAULT_PAYMENT_SETTINGS,
    loading,
  };
}
