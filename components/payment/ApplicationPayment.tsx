"use client";

import { PaymentInfoBlock } from "@/components/forms/PaymentInfoBlock";
import { usePaymentSettings } from "@/components/forms/usePaymentSettings";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { Button } from "@/components/ui/Button";
import { PriceLabel, PricingBlock } from "@/components/ui/PriceLabel";
import { SHOW_PRICING } from "@/lib/features";
import { trackEvent } from "@/lib/analytics";
import {
  generatePaymentReference,
  getPaymentLabel,
  getServicePaymentAmount,
  initiateFlutterwavePayment,
  initiatePaystackPayment,
  type PaymentGatewayKeys,
} from "@/services/payment";
import type { Application, PaymentProvider, PaymentType, ServiceItem } from "@/types";
import { CreditCard, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ApplicationPaymentProps {
  application: Application;
  service: ServiceItem;
  onPaymentComplete: (reference: string, type: PaymentType, amount: number, provider: PaymentProvider) => Promise<void>;
}

const paymentTypes: PaymentType[] = ["booking-fee", "deposit", "full"];

export function ApplicationPayment({ application, service, onPaymentComplete }: ApplicationPaymentProps) {
  const { settings } = usePaymentSettings();
  const providers = useMemo(() => {
    const list: PaymentProvider[] = [];
    if (settings.paystackEnabled) list.push("paystack");
    if (settings.flutterwaveEnabled) list.push("flutterwave");
    return list;
  }, [settings.paystackEnabled, settings.flutterwaveEnabled]);

  const [type, setType] = useState<PaymentType>("booking-fee");
  const [provider, setProvider] = useState<PaymentProvider>("paystack");
  const [loading, setLoading] = useState(false);
  const [gatewayKeys, setGatewayKeys] = useState<PaymentGatewayKeys | null>(null);
  const track = useLeadTrackerContext();

  useEffect(() => {
    fetch("/api/payment-keys")
      .then((r) => r.json())
      .then((data) => {
        if (data?.paystack && data?.flutterwave) {
          setGatewayKeys({ paystack: data.paystack, flutterwave: data.flutterwave });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (providers.length && !providers.includes(provider)) {
      setProvider(providers[0]);
    }
  }, [providers, provider]);

  const amount = getServicePaymentAmount(type, service);

  const handlePay = async () => {
    if (!providers.length || !gatewayKeys) return;
    track({ actionType: "payment_attempt", service: service.slug, source: provider });
    trackEvent({ eventType: "payment_attempt", element: service.slug, metadata: { provider, type } });
    setLoading(true);
    const reference = generatePaymentReference();
    const config = {
      amount,
      email: application.email,
      name: application.full_name,
      reference,
      type,
      provider,
      onSuccess: async () => {
        await onPaymentComplete(reference, type, amount, provider);
        setLoading(false);
      },
    };

    try {
      if (provider === "paystack") {
        await initiatePaystackPayment(config, gatewayKeys);
      } else {
        await initiateFlutterwavePayment(config, gatewayKeys);
      }
      if (loading) setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {!SHOW_PRICING && <PricingBlock />}

      {settings.showBankTransfer && <PaymentInfoBlock settings={settings} />}

      <div className="grid gap-3 sm:grid-cols-3">
        {paymentTypes.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-xl border p-4 text-left transition-all ${
              type === t
                ? "border-gold-500 bg-gold-500/10 ring-2 ring-gold-500/30"
                : "border-navy-200 dark:border-navy-700"
            }`}
          >
            <p className="font-medium">{getPaymentLabel(t)}</p>
            <p className="mt-1">
              <PriceLabel amount={getServicePaymentAmount(t, service)} variant="consultation" />
            </p>
          </button>
        ))}
      </div>

      {providers.length > 0 ? (
        <>
          <div className="flex gap-3">
            {providers.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setProvider(p)}
                className={`flex-1 rounded-xl border px-4 py-3 capitalize ${
                  provider === p
                    ? "border-gold-500 bg-gold-500/10"
                    : "border-navy-200 dark:border-navy-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-navy-100 bg-navy-50 p-6 dark:border-navy-800 dark:bg-navy-900/50">
            <p className="text-sm text-navy-500">Payment summary</p>
            <p className="font-display text-2xl font-bold">
              <PriceLabel amount={amount} variant="consultation" className="text-2xl" />
            </p>
            <p className="mt-2 text-sm text-navy-600 dark:text-navy-300">
              Service: {service.title} · Applicant: {application.full_name}
            </p>
          </div>

          <Button onClick={handlePay} size="lg" disabled={loading || !gatewayKeys} className="w-full sm:w-auto">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-4 w-4" />
            )}
            Pay with {provider === "paystack" ? "Paystack" : "Flutterwave"}
          </Button>
        </>
      ) : (
        <p className="rounded-xl border border-dashed border-navy-300 p-6 text-center text-sm text-navy-600 dark:text-navy-400">
          Online card payment is temporarily unavailable. Please use bank transfer above and enter your
          reference in the application form.
        </p>
      )}
    </div>
  );
}
