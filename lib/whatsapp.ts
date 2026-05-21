import { APPLICATION_WHATSAPP_MESSAGE, getWhatsAppUrl } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export function getServiceWhatsAppMessage(serviceName: string): string {
  return `Hello, I am interested in the ${serviceName} service from Darboi Consults Limited.`;
}

export function getProgramWhatsAppMessage(programTitle: string): string {
  return `Hello, I am interested in the ${programTitle} program. Please share more details.`;
}

export function getConsultationWhatsAppMessage(context: string): string {
  return `Hello, I would like to start a consultation regarding: ${context}.`;
}

export function getApplicationWhatsAppMessage(options: {
  applicationId?: string | null;
  reference?: string | null;
  serviceName?: string;
  paymentAmount?: number;
  applicantName?: string;
}): string {
  const lines = [APPLICATION_WHATSAPP_MESSAGE];

  if (options.serviceName) {
    lines.push(`Service: ${options.serviceName}`);
  }
  if (options.applicantName) {
    lines.push(`Name: ${options.applicantName}`);
  }
  if (options.applicationId) {
    lines.push(`Application ID: ${options.applicationId}`);
  }
  if (options.reference) {
    lines.push(`Payment reference: ${options.reference}`);
  }
  if (options.paymentAmount != null && options.paymentAmount > 0) {
    lines.push(`Amount paid: ${formatPrice(options.paymentAmount)}`);
  }

  return lines.join("\n");
}

export function openWhatsApp(message: string): string {
  return getWhatsAppUrl(message);
}

export function redirectToWhatsApp(message: string): void {
  window.location.href = getWhatsAppUrl(message);
}
