"use client";

import { PaymentDetailsModal } from "@/components/payment/PaymentDetailsModal";
import { usePaymentSettings } from "@/components/forms/usePaymentSettings";
import {
  DEFAULT_PAYMENT_SETTINGS,
  type PaymentSettings,
} from "@/data/payment-settings-default";
import { formatPrice } from "@/lib/utils";
import type { Application } from "@/types";
import { CreditCard } from "lucide-react";
import { useState } from "react";

interface BankTransferCheckoutProps {
  application: Application;
  serviceTitle: string;
  amount: number;
  amountLabel?: string;
  paymentSettings?: PaymentSettings;
  onPaymentComplete: (reference: string, amount: number) => Promise<void>;
}

export function BankTransferCheckout({
  application,
  serviceTitle,
  amount,
  amountLabel,
  paymentSettings: settingsOverride,
  onPaymentComplete,
}: BankTransferCheckoutProps) {
  const { settings: fetched, loading } = usePaymentSettings();
  const base = settingsOverride ?? (loading ? DEFAULT_PAYMENT_SETTINGS : fetched);
  const settings: PaymentSettings = {
    ...base,
    feeAmount: amount,
    feeAmountLabel: amountLabel ?? formatPrice(amount),
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const handleDone = async (reference: string) => {
    setFinishing(true);
    try {
      await onPaymentComplete(reference, amount);
    } finally {
      setFinishing(false);
      setModalOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gold-500/30 bg-gold-500/5 p-6 text-center">
          <p className="text-sm text-navy-600 dark:text-navy-400">Amount to pay</p>
          <p className="mt-2 font-display text-3xl font-bold text-navy-900 dark:text-white">
            {settings.feeAmountLabel}
          </p>
          <p className="mt-2 text-sm text-navy-600 dark:text-navy-300">
            {serviceTitle} · {application.full_name}
          </p>
        </div>

        <p className="text-center text-sm text-navy-600 dark:text-navy-400">
          Tap below to view bank details. Copy the account information, make your transfer, then
          confirm payment.
        </p>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mx-auto flex w-full min-w-[240px] items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-3.5 text-sm font-bold text-navy-950 hover:bg-gold-400 sm:w-auto"
        >
          <CreditCard className="h-5 w-5" />
          Make payment
        </button>
      </div>

      <PaymentDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onDone={handleDone}
        settings={settings}
        loadingDone={finishing}
        doneLabel="I've made payment — Open WhatsApp"
      />
    </>
  );
}
