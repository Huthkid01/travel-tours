import type { ConsultationFormSchema } from "@/types";

export const defaultConsultationFields: ConsultationFormSchema["fields"] = [
  { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "John Doe" },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone Number", type: "phone", required: true },
  { name: "country", label: "Country", type: "country", required: true },
  { name: "travelPurpose", label: "Purpose of Travel / Service", type: "select", required: true, options: [
    { label: "Tourism", value: "tourism" },
    { label: "Business", value: "business" },
    { label: "Study", value: "study" },
    { label: "Immigration", value: "immigration" },
    { label: "Other", value: "other" },
  ]},
  { name: "destination", label: "Destination Country", type: "text", showWhen: { field: "travelPurpose", value: "tourism" } },
  { name: "employer", label: "Employer Name", type: "text", showWhen: { field: "travelPurpose", value: "business" } },
  { name: "notes", label: "Additional Notes", type: "textarea", placeholder: "Tell us more about your needs..." },
];

export const consultationSchemas: ConsultationFormSchema[] = [
  {
    id: "general",
    title: "General Consultation",
    description: "Tell us what you need — we'll guide you through the right service.",
    fields: defaultConsultationFields,
    enableFileUpload: true,
    enablePayment: false,
  },
  {
    id: "program",
    title: "Program Consultation",
    fields: defaultConsultationFields,
    enableFileUpload: true,
    enablePayment: true,
  },
  {
    id: "service",
    title: "Service Consultation",
    fields: defaultConsultationFields,
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
