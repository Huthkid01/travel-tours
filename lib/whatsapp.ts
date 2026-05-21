import { getWhatsAppUrl } from "@/lib/constants";

export function getServiceWhatsAppMessage(serviceName: string): string {
  return `Hello, I am interested in the ${serviceName} service from Da Boi Consults Limited.`;
}

export function getProgramWhatsAppMessage(programTitle: string): string {
  return `Hello, I am interested in the ${programTitle} program. Please share more details.`;
}

export function getConsultationWhatsAppMessage(context: string): string {
  return `Hello, I would like to start a consultation regarding: ${context}.`;
}

export function openWhatsApp(message: string): string {
  return getWhatsAppUrl(message);
}
