import { PAYMENT_KEYS, SITE_CONFIG, CURRENCY } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { PaymentProvider, PaymentType, ServiceItem } from "@/types";

export interface PaymentConfig {
  amount: number;
  email: string;
  name: string;
  reference: string;
  type: PaymentType;
  provider: PaymentProvider;
  onSuccess?: () => void;
}

export function getServicePaymentAmount(
  type: PaymentType,
  service: Pick<ServiceItem, "pricing">
): number {
  switch (type) {
    case "booking-fee":
      return service.pricing.bookingFee;
    case "deposit":
      return service.pricing.deposit;
    case "full":
      return service.pricing.full;
    default:
      return service.pricing.bookingFee;
  }
}

const PAYMENT_LABELS: Record<PaymentType, string> = {
  "booking-fee": "Booking Fee",
  deposit: "Deposit (30%)",
  full: "Full Payment",
};

export function getPaymentLabel(type: PaymentType): string {
  return PAYMENT_LABELS[type];
}

export function initiateFlutterwavePayment(config: PaymentConfig): void {
  const { amount, email, name, reference, onSuccess } = config;

  if (PAYMENT_KEYS.flutterwave.includes("demo")) {
    console.log("[Flutterwave Demo]", { amount, email, name, reference });
    alert(
      `Flutterwave Demo Payment\n\nAmount: ${formatPrice(amount)}\nEmail: ${email}\nReference: ${reference}\n\nIn production, Flutterwave checkout opens here.`
    );
    onSuccess?.();
    return;
  }

  const script = document.createElement("script");
  script.src = "https://checkout.flutterwave.com/v3.js";
  script.onload = () => {
    window.FlutterwaveCheckout?.({
      public_key: PAYMENT_KEYS.flutterwave,
      tx_ref: reference,
      amount,
      currency: CURRENCY.code,
      payment_options: "card, banktransfer, ussd",
      customer: { email, name },
      callback: () => onSuccess?.(),
      customizations: {
        title: SITE_CONFIG.name,
        description: `Payment - ${getPaymentLabel(config.type)}`,
      },
    });
  };
  document.body.appendChild(script);
}

export function initiatePaystackPayment(config: PaymentConfig): void {
  const { amount, email, name, reference, onSuccess } = config;

  if (PAYMENT_KEYS.paystack.includes("demo")) {
    console.log("[Paystack Demo]", { amount, email, name, reference });
    alert(
      `Paystack Demo Payment\n\nAmount: ${formatPrice(amount)}\nEmail: ${email}\nReference: ${reference}\n\nIn production, Paystack popup opens here.`
    );
    onSuccess?.();
    return;
  }

  const script = document.createElement("script");
  script.src = "https://js.paystack.co/v1/inline.js";
  script.onload = () => {
    const handler = window.PaystackPop?.setup({
      key: PAYMENT_KEYS.paystack,
      email,
      amount: amount * 100,
      currency: CURRENCY.code,
      ref: reference,
      callback: () => onSuccess?.(),
      metadata: { custom_fields: [{ display_name: "Customer", variable_name: "customer", value: name }] },
    });
    handler?.openIframe();
  };
  document.body.appendChild(script);
}

export function generatePaymentReference(): string {
  return `DBC-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}
