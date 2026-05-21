import type { ServiceApplicationFormConfig } from "@/data/service-application-forms";
import type { ServiceApplicationFormValues } from "@/lib/service-application-schema";
import type { ApplicationFormData } from "@/types";

export function formatServiceApplicationNotes(
  data: ServiceApplicationFormValues,
  config: ServiceApplicationFormConfig
): string {
  const lines: string[] = [];
  const f = config.fields ?? {};

  if ("dateOfBirth" in data && data.dateOfBirth) lines.push(`Date of Birth: ${data.dateOfBirth}`);
  if (f.maritalStatus && "maritalStatus" in data && data.maritalStatus) {
    lines.push(`Marital Status: ${data.maritalStatus}`);
  }
  if (f.sex && "sex" in data && data.sex) lines.push(`Sex: ${data.sex}`);
  if (f.idNumber && "idOrPassportNumber" in data && data.idOrPassportNumber) {
    lines.push(`${f.idNumberLabel ?? "ID"}: ${data.idOrPassportNumber}`);
  }
  if (f.passportNumber && "passportNumber" in data && data.passportNumber) {
    lines.push(`Passport Number: ${data.passportNumber}`);
  }
  if (f.travelDestination && "travelDestination" in data && data.travelDestination) {
    lines.push(`Destination: ${data.travelDestination}`);
  }
  if (f.travelDates && "travelDates" in data && data.travelDates) {
    lines.push(`Travel Dates: ${data.travelDates}`);
  }
  if (f.witnessOrAdditionalInfo && "witnessOrAdditionalInfo" in data && data.witnessOrAdditionalInfo) {
    lines.push(`Witness / Additional: ${data.witnessOrAdditionalInfo}`);
  }
  if ("paymentReference" in data && data.paymentReference?.trim()) {
    lines.push(`Payment Reference: ${data.paymentReference.trim()}`);
  }

  return lines.join("\n");
}

export function mapServiceToApplicationData(
  data: ServiceApplicationFormValues,
  config: ServiceApplicationFormConfig,
  serviceTitle: string
): ApplicationFormData {
  const purpose =
    ("purposeDetails" in data && data.purposeDetails) ||
    ("witnessOrAdditionalInfo" in data && data.witnessOrAdditionalInfo) ||
    serviceTitle;

  const country =
    ("travelDestination" in data && data.travelDestination) || "Nigeria";

  return {
    fullName: data.fullLegalName,
    email: data.email,
    phone: data.phone,
    country,
    address: data.homeAddress,
    purpose: typeof purpose === "string" ? purpose : serviceTitle,
    notes: formatServiceApplicationNotes(data, config),
  };
}
