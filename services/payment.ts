import { PAYMENT_KEYS, SITE_CONFIG, CURRENCY } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { PaymentProvider, PaymentType } from "@/types";

export interface PaymentConfig {
  amount: number;
  email: string;
  name: string;
  reference: string;
  type: PaymentType;
  provider: PaymentProvider;
}

const PAYMENT_AMOUNTS: Record<PaymentType, { label: string; getAmount: (base: number) => number }> = {
  "booking-fee": {
    label: "Booking Fee",
    getAmount: () => 250_000,
  },
  deposit: {
    label: "Deposit (30%)",
    getAmount: (base) => Math.round(base * 0.3),
  },
  full: {
    label: "Full Payment",
    getAmount: (base) => base,
  },
};

export function getPaymentAmount(type: PaymentType, tourPrice = 5_000_000): number {
  return PAYMENT_AMOUNTS[type].getAmount(tourPrice);
}

export function getPaymentLabel(type: PaymentType): string {
  return PAYMENT_AMOUNTS[type].label;
}

export function initiateFlutterwavePayment(config: PaymentConfig): void {
  const { amount, email, name, reference } = config;

  // Demo mode - show alert and log
  if (PAYMENT_KEYS.flutterwave.includes("demo")) {
    console.log("[Flutterwave Demo]", { amount, email, name, reference });
    alert(
      `Flutterwave Demo Payment\n\nAmount: ${formatPrice(amount)}\nEmail: ${email}\nName: ${name}\nReference: ${reference}\n\nIn production, this would open the Flutterwave checkout modal.`
    );
    return;
  }

  // Production Flutterwave inline
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
      customizations: {
        title: SITE_CONFIG.name,
        description: `Payment - ${getPaymentLabel(config.type)}`,
        logo: `${SITE_CONFIG.url}/logo.png`,
      },
    });
  };
  document.body.appendChild(script);
}

export function initiatePaystackPayment(config: PaymentConfig): void {
  const { amount, email, name, reference } = config;

  if (PAYMENT_KEYS.paystack.includes("demo")) {
    console.log("[Paystack Demo]", { amount, email, name, reference });
    alert(
      `Paystack Demo Payment\n\nAmount: ${formatPrice(amount)}\nEmail: ${email}\nName: ${name}\nReference: ${reference}\n\nIn production, this would open the Paystack popup.`
    );
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
      metadata: { custom_fields: [{ display_name: "Customer", variable_name: "customer", value: name }] },
    });
    handler?.openIframe();
  };
  document.body.appendChild(script);
}

export function generatePaymentReference(): string {
  return `VE-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}
