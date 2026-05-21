export const GOOGLE_FORM_CONSENT_KEY = "darboi_google_form_consent";

export type GoogleFormConsentStatus = "accepted" | "rejected";

export function readGoogleFormConsent(): GoogleFormConsentStatus | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(GOOGLE_FORM_CONSENT_KEY);
  if (value === "true") return "accepted";
  if (value === "false") return "rejected";
  return null;
}

export function writeGoogleFormConsent(status: GoogleFormConsentStatus) {
  localStorage.setItem(GOOGLE_FORM_CONSENT_KEY, status === "accepted" ? "true" : "false");
}
