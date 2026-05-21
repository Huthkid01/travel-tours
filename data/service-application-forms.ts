import type { ServiceItem } from "@/types";

export interface ServiceUploadField {
  key: string;
  label: string;
  required: boolean;
  hint?: string;
}

export interface ServiceApplicationFormConfig {
  /** Use full Darboi visa form (programs / embassy-style services) */
  useVisaForm?: boolean;
  fields?: {
    dateOfBirth?: boolean;
    maritalStatus?: boolean;
    sex?: boolean;
    /** National ID or passport number — not always required */
    idNumber?: boolean;
    idNumberLabel?: string;
    idNumberRequired?: boolean;
    passportNumber?: boolean;
    travelDestination?: boolean;
    travelDates?: boolean;
    witnessOrAdditionalInfo?: boolean;
  };
  purposeLabel?: string;
  purposePlaceholder?: string;
  purposeRequired?: boolean;
  uploads?: ServiceUploadField[];
  showPaymentInfo?: boolean;
  headerNote?: string;
}

const DEFAULT_DOCUMENTATION: ServiceApplicationFormConfig = {
  fields: {
    dateOfBirth: true,
    idNumber: true,
    idNumberLabel: "National ID or passport number (if applicable)",
    idNumberRequired: false,
  },
  purposeLabel: "Additional details",
  purposePlaceholder: "Tell us what you need help with",
  purposeRequired: true,
  uploads: [
    { key: "validId", label: "Valid ID", required: true },
    { key: "supportingDocuments", label: "Supporting documents", required: true, hint: "PDF or image, max 10 MB each" },
  ],
  showPaymentInfo: true,
};

/** Per-service application fields — only what each service actually needs */
export const SERVICE_APPLICATION_FORMS: Record<string, ServiceApplicationFormConfig> = {
  "marriage-certificate": {
    fields: {
      dateOfBirth: true,
      maritalStatus: true,
      sex: true,
    },
    purposeLabel: "Witness details / additional information",
    purposePlaceholder: "Witness names and contact if applicable",
    purposeRequired: false,
    uploads: [
      { key: "validId", label: "Valid ID", required: true },
      { key: "marriageAffidavit", label: "Marriage affidavit or court record", required: true },
      { key: "passportPhoto", label: "Passport photograph", required: true },
    ],
    headerNote: "Documents required for marriage certificate processing only.",
  },
  ndlea: {
    fields: {
      dateOfBirth: true,
      sex: true,
      idNumber: true,
      idNumberLabel: "National ID or passport number",
      idNumberRequired: true,
    },
    purposeLabel: "Application notes",
    purposePlaceholder: "Any supporting context for your NDLEA application",
    uploads: [
      { key: "validId", label: "Valid passport or national ID", required: true },
      { key: "applicationForm", label: "Completed application form (if you have it)", required: false },
      { key: "passportPhoto", label: "Passport photograph", required: true },
      { key: "supportingLetters", label: "Supporting letters (if required)", required: false },
    ],
    headerNote: "NDLEA clearance documentation only — no travel programme details required.",
  },
  "yellow-vaccine-certificate": {
    fields: {
      dateOfBirth: true,
      passportNumber: true,
      travelDestination: true,
      travelDates: true,
    },
    purposeLabel: "Travel notes",
    purposePlaceholder: "Flight dates, destination, or clinic preference",
    uploads: [
      { key: "internationalPassport", label: "International passport (data page)", required: true },
      { key: "vaccinationCard", label: "Existing vaccination card (if any)", required: false },
      { key: "itinerary", label: "Travel itinerary", required: false },
      { key: "passportPhoto", label: "Passport photograph", required: true },
    ],
  },
  "employment-documents": {
    fields: { dateOfBirth: true, idNumber: true, idNumberLabel: "Valid ID number", idNumberRequired: true },
    purposeLabel: "Role / employer details",
    purposePlaceholder: "Job title, company name, country of employment",
    uploads: [
      { key: "cv", label: "CV / Resume", required: true },
      { key: "offerLetter", label: "Offer letter or employer details", required: true },
      { key: "validId", label: "Valid ID", required: true },
      { key: "certificates", label: "Educational certificates", required: false },
    ],
  },
  "land-documents": {
    fields: { idNumber: true, idNumberLabel: "Valid ID number", idNumberRequired: true },
    purposeLabel: "Property address & details",
    purposePlaceholder: "Full property address and brief description",
    purposeRequired: true,
    uploads: [
      { key: "ownershipProof", label: "Proof of ownership or purchase", required: true },
      { key: "surveyPlan", label: "Survey plan (if available)", required: false },
      { key: "validId", label: "Valid ID", required: true },
    ],
  },
  "police-character-certificate": {
    fields: { dateOfBirth: true, sex: true, idNumber: true, idNumberLabel: "Valid ID number", idNumberRequired: true },
    purposeLabel: "Purpose of application",
    purposePlaceholder: "e.g. Employment, travel, immigration",
    purposeRequired: true,
    uploads: [
      { key: "validId", label: "Valid ID", required: true },
      { key: "passportPhoto", label: "Passport photograph", required: true },
      { key: "fingerprintCard", label: "Fingerprint card (if required)", required: false },
      { key: "purposeLetter", label: "Purpose letter", required: false },
    ],
  },
  "investment-certificate": {
    fields: { idNumber: true, idNumberLabel: "Valid ID / company registration", idNumberRequired: true },
    purposeLabel: "Investment purpose",
    purposePlaceholder: "Why you need the certificate",
    uploads: [
      { key: "bankStatements", label: "Bank statements", required: true },
      { key: "investmentProof", label: "Proof of investment", required: true },
      { key: "validId", label: "Valid ID", required: true },
      { key: "companyDocuments", label: "Company documents (if corporate)", required: false },
    ],
  },
  "newspaper-publication": {
    fields: { idNumber: true, idNumberLabel: "Valid ID number", idNumberRequired: true },
    purposeLabel: "Publication details",
    purposePlaceholder: "Type of notice, preferred newspaper, dates",
    uploads: [
      { key: "publicationDraft", label: "Publication content draft", required: true },
      { key: "validId", label: "Valid ID", required: true },
      { key: "courtOrder", label: "Supporting court order (if applicable)", required: false },
    ],
  },
  "change-of-name": {
    fields: { maritalStatus: true, idNumber: true, idNumberLabel: "Valid ID number", idNumberRequired: true },
    purposeLabel: "Name change details",
    purposePlaceholder: "Current name and name you wish to use",
    purposeRequired: true,
    uploads: [
      { key: "affidavit", label: "Affidavit of change of name", required: true },
      { key: "validId", label: "Valid ID", required: true },
      { key: "publicationProof", label: "Newspaper publication proof (if any)", required: false },
      { key: "passportPhoto", label: "Passport photograph", required: true },
    ],
  },
  "flight-reservation": {
    fields: {
      dateOfBirth: true,
      passportNumber: true,
      travelDestination: true,
      travelDates: true,
    },
    purposeLabel: "Passenger & flight details",
    purposePlaceholder: "Full name on ticket, route, preferred airline",
    uploads: [
      { key: "passport", label: "Valid passport (data page)", required: true },
    ],
  },
  "travel-insurance-certificate": {
    fields: {
      dateOfBirth: true,
      passportNumber: true,
      travelDestination: true,
      travelDates: true,
    },
    purposeLabel: "Coverage requirements",
    purposePlaceholder: "Schengen, embassy, or destination-specific needs",
    uploads: [
      { key: "passport", label: "Valid passport (data page)", required: true },
    ],
  },
  "hotel-reservation": {
    fields: {
      passportNumber: true,
      travelDestination: true,
      travelDates: true,
    },
    purposeLabel: "Hotel & guest details",
    purposePlaceholder: "City, hotel preference, guest names",
    uploads: [
      { key: "passport", label: "Valid passport (data page)", required: true },
    ],
  },
  "driving-licence": {
    fields: { dateOfBirth: true, sex: true, idNumber: true, idNumberLabel: "Valid ID number", idNumberRequired: true },
    purposeLabel: "Licence application type",
    purposePlaceholder: "New application, renewal, or international permit",
    uploads: [
      { key: "validId", label: "Valid ID", required: true },
      { key: "passportPhoto", label: "Passport photograph", required: true },
      { key: "learnerPermit", label: "Learner permit or existing licence", required: false },
      { key: "medicalFitness", label: "Medical fitness certificate (if required)", required: false },
    ],
  },
  "appointment-booking": {
    fields: {
      passportNumber: true,
      travelDestination: true,
      travelDates: true,
    },
    purposeLabel: "Appointment details",
    purposePlaceholder: "Embassy/consulate, service type, preferred dates",
    purposeRequired: true,
    uploads: [
      { key: "passport", label: "Valid passport (data page)", required: true },
      { key: "applicationReference", label: "Application reference (if any)", required: false },
    ],
  },
};

export function getServiceApplicationConfig(slug: string): ServiceApplicationFormConfig {
  return SERVICE_APPLICATION_FORMS[slug] ?? DEFAULT_DOCUMENTATION;
}

export function serviceUsesVisaForm(slug: string): boolean {
  return getServiceApplicationConfig(slug).useVisaForm === true;
}

export function getServiceFormTitle(service: ServiceItem): string {
  return `Applying for: ${service.title}`;
}
