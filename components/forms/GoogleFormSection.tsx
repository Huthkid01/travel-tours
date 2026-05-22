import { GoogleFormEmbed } from "@/components/forms/GoogleFormEmbed";

interface GoogleFormSectionProps {
  title?: string;
  description?: string;
}

export function GoogleFormSection({
  title = "Consultation Form",
  description = "Complete our official Google Form to start your consultation.",
}: GoogleFormSectionProps) {
  return <GoogleFormEmbed title={title} description={description} />;
}
