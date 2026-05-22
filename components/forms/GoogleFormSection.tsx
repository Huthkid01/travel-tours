import { ConsultationFormSection } from "@/components/forms/ConsultationFormSection";

interface GoogleFormSectionProps {
  title?: string;
  description?: string;
}

/** @deprecated Name kept for imports — renders native consultation form (no Google iframe). */
export function GoogleFormSection({
  title = "Consultation Form",
  description = "Submit your details below. After you submit, pay by bank transfer to confirm your consultation.",
}: GoogleFormSectionProps) {
  return <ConsultationFormSection title={title} description={description} />;
}
