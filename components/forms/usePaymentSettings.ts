"use client";

import { DEFAULT_PAYMENT_SETTINGS, type PaymentSettings } from "@/data/payment-settings-default";
import { useEffect, useState } from "react";

export function usePaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payment-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setSettings(data as PaymentSettings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
