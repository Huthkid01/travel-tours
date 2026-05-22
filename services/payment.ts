import { appConfirm } from "@/lib/confirm";
import { CURRENCY, SITE_CONFIG } from "@/lib/constants";
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

export interface PaymentGatewayKeys {
  paystack: string;
  flutterwave: string;
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

export async function initiateFlutterwavePayment(
  config: PaymentConfig,
  keys: PaymentGatewayKeys
): Promise<void> {
  const { amount, email, name, reference, onSuccess } = config;

  if (keys.flutterwave.includes("demo")) {
    console.log("[Flutterwave Demo]", { amount, email, name, reference });
    const confirmed = await appConfirm({
      title: "Flutterwave demo payment",
      description: `Amount: ${formatPrice(amount)}\nEmail: ${email}\nReference: ${reference}\n\nConfirm when done to continue to WhatsApp.`,
      confirmLabel: "Continue",
    });
    if (confirmed) onSuccess?.();
    return;
  }

  const script = document.createElement("script");
  script.src = "https://checkout.flutterwave.com/v3.js";
  script.onload = () => {
    window.FlutterwaveCheckout?.({
      public_key: keys.flutterwave,
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

export async function initiatePaystackPayment(
  config: PaymentConfig,
  keys: PaymentGatewayKeys
): Promise<void> {
  const { amount, email, name, reference, onSuccess } = config;

  if (keys.paystack.includes("demo")) {
    console.log("[Paystack Demo]", { amount, email, name, reference });
    const confirmed = await appConfirm({
      title: "Paystack demo payment",
      description: `Amount: ${formatPrice(amount)}\nEmail: ${email}\nReference: ${reference}\n\nConfirm when done to continue to WhatsApp.`,
      confirmLabel: "Continue",
    });
    if (confirmed) onSuccess?.();
    return;
  }

  const script = document.createElement("script");
  script.src = "https://js.paystack.co/v1/inline.js";
  script.onload = () => {
    const handler = window.PaystackPop?.setup({
      key: keys.paystack,
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
