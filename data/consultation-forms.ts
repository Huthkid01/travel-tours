import type { ConsultationFormSchema } from "@/types";

/**
 * Consultation uses DarboiApplicationForm (see components/forms/DarboiApplicationForm.tsx).
 * Schemas below are metadata for titles / payment routing only.
 */

export const consultationSchemas: ConsultationFormSchema[] = [
  {
    id: "general",
    title: "General Consultation",
    description: "Complete the DARBOI application form — all fields match our official Google Form.",
    fields: [],
    enableFileUpload: true,
    enablePayment: false,
  },
  {
    id: "program",
    title: "Program Consultation",
    fields: [],
    enableFileUpload: true,
    enablePayment: true,
  },
  {
    id: "service",
    title: "Service Consultation",
    fields: [],
    enableFileUpload: true,
    enablePayment: true,
  },
];

export function getConsultationSchema(
  type: "general" | "program" | "service",
  contextTitle?: string
): ConsultationFormSchema {
  const base = consultationSchemas.find((s) => s.id === type) ?? consultationSchemas[0];
  return {
    ...base,
    title: contextTitle ? `Consultation: ${contextTitle}` : base.title,
  };
}
