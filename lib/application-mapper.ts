import type { DarboiApplicationFormValues } from "@/lib/validations";
import type { ApplicationFormData } from "@/types";

export function formatDarboiApplicationNotes(data: DarboiApplicationFormValues): string {
  const lines = [
    `Date of Birth: ${data.dateOfBirth}`,
    `Marital Status: ${data.maritalStatus}`,
    `Sex: ${data.sex}`,
    `Passport Number: ${data.passportNumber}`,
  ];
  if (data.paymentReference?.trim()) {
    lines.push(`Payment Reference: ${data.paymentReference.trim()}`);
  }
  return lines.join("\n");
}

/** Map Darboi form → legacy application record fields (Supabase-compatible) */
export function mapDarboiToApplicationData(data: DarboiApplicationFormValues): ApplicationFormData {
  return {
    fullName: data.fullLegalName,
    email: data.email,
    phone: data.phone,
    country: data.countryOfChoice,
    address: data.homeAddress,
    purpose: data.preferredProgramme,
    notes: formatDarboiApplicationNotes(data),
  };
}
