import type { ServiceCategory, ServiceItem } from "@/types";

/** Travel & embassy booking — consultation applies; land docs, NDLEA, etc. use Apply only */
const CONSULTATION_CATEGORIES: ServiceCategory[] = ["travel", "booking"];

export function serviceOffersConsultation(
  service: Pick<ServiceItem, "category"> | null | undefined
): boolean {
  if (!service) return false;
  return CONSULTATION_CATEGORIES.includes(service.category);
}
