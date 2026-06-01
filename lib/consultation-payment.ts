import {
  DEFAULT_PAYMENT_SETTINGS,
  type PaymentSettings,
} from "@/data/payment-settings-default";
import { APPOINTMENT_FEE_INFO } from "@/data/darboi-application-form";

/**
 * @deprecated Use admin → Payment methods and `/api/payment-settings` instead.
 * Kept only as a fallback reference; do not pass into application flows.
 */
export const CONSULTATION_PAYMENT_SETTINGS: PaymentSettings = {
  ...DEFAULT_PAYMENT_SETTINGS,
  title: "Consultation fee",
  feeAmount: APPOINTMENT_FEE_INFO.amount,
  feeAmountLabel: APPOINTMENT_FEE_INFO.amountLabel,
  paystackEnabled: false,
  flutterwaveEnabled: false,
  showBankTransfer: true,
};
