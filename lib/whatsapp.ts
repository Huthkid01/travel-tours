import { getWhatsAppUrl } from "@/lib/constants";
import { getPaymentLabel } from "@/services/payment";
import { formatPrice } from "@/lib/utils";
import type { PaymentType } from "@/types";

export function getServiceWhatsAppMessage(serviceName: string): string {
  return `Hello, I am interested in the ${serviceName} service from Darboi Consults Limited.`;
}

export function getProgramWhatsAppMessage(programTitle: string): string {
  return `Hello, I am interested in the ${programTitle} program. Please share more details.`;
}

export function getConsultationWhatsAppMessage(context: string): string {
  return `Hello, I would like to start a consultation regarding: ${context}.`;
}

export type ApplicationWhatsAppStage = "submitted" | "paid";

export function getApplicationWhatsAppMessage(options: {
  stage?: ApplicationWhatsAppStage;
  applicationId?: string | null;
  reference?: string | null;
  serviceName?: string;
  paymentAmount?: number;
  paymentType?: PaymentType | string | null;
  applicantName?: string;
}): string {
  const name = options.applicantName?.trim();
  const isPaid =
    options.stage === "paid" ||
    (options.paymentAmount != null && options.paymentAmount > 0) ||
    Boolean(options.reference?.trim());

  const lines: string[] = ["Hello,"];

  if (isPaid) {
    lines.push("I have already made payment on your website.");
  } else {
    lines.push("I have submitted my application on your website.");
  }

  lines.push("");

  if (name) {
    lines.push(`Name: ${name}`);
  }

  if (options.serviceName) {
    lines.push(isPaid ? `Paid for: ${options.serviceName}` : `Service: ${options.serviceName}`);
  }

  if (isPaid && options.paymentType) {
    const label =
      options.paymentType === "booking-fee" ||
      options.paymentType === "deposit" ||
      options.paymentType === "full"
        ? getPaymentLabel(options.paymentType)
        : String(options.paymentType);
    lines.push(`Payment type: ${label}`);
  }

  if (options.paymentAmount != null && options.paymentAmount > 0) {
    lines.push(`Amount paid: ${formatPrice(options.paymentAmount)}`);
  }

  if (options.reference?.trim()) {
    lines.push(`Payment reference: ${options.reference.trim()}`);
  }

  if (options.applicationId) {
    lines.push(`Application ID: ${options.applicationId}`);
  }

  lines.push(
    "",
    isPaid
      ? "Please confirm my payment and tell me the next steps for my application. Thank you."
      : "Please review my application and tell me the next steps. Thank you."
  );

  return lines.join("\n");
}

export function openWhatsApp(message: string): string {
  return getWhatsAppUrl(message);
}

export function redirectToWhatsApp(message: string): void {
  window.location.href = getWhatsAppUrl(message);
}
