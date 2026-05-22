import { APPOINTMENT_FEE_INFO } from "@/data/darboi-application-form";

export interface PaymentSettings {
  title: string;
  feeAmount: number;
  feeAmountLabel: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  afterPaymentNote: string;
  paystackEnabled: boolean;
  flutterwaveEnabled: boolean;
  showBankTransfer: boolean;
}

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  title: "Appointment fees for procurement",
  feeAmount: APPOINTMENT_FEE_INFO.amount,
  feeAmountLabel: APPOINTMENT_FEE_INFO.amountLabel,
  bankName: APPOINTMENT_FEE_INFO.bankName,
  accountNumber: APPOINTMENT_FEE_INFO.accountNumber,
  accountName: APPOINTMENT_FEE_INFO.accountName,
  afterPaymentNote: "After payment, enter your transfer reference or depositor name below.",
  paystackEnabled: false,
  flutterwaveEnabled: false,
  showBankTransfer: true,
};
