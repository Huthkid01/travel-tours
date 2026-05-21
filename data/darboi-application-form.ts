/** Matches DARBOI CONSULTS Google Application Form */

export const DARBOI_FORM_MOTTO = "Chance favoured prepared minds";

export const MARITAL_STATUS_OPTIONS = [
  { label: "Single", value: "single" },
  { label: "Married", value: "married" },
  { label: "Divorced", value: "divorced" },
  { label: "Separated", value: "separated" },
  { label: "Widowed", value: "widowed" },
] as const;

export const SEX_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
] as const;

export const APPOINTMENT_FEE_INFO = {
  amount: 35_000,
  amountLabel: "N35,000 (Thirty Five Thousand Naira)",
  bankName: "The Alternative Bank",
  accountNumber: "0511151496",
  accountName: "DARBOI CONSULTS LIMITED",
} as const;

export const PASSPORT_MATCH_NOTE =
  "Every information must match your PASSPORT details exactly.";
