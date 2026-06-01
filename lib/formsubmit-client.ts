"use client";

/** @deprecated Import from @/lib/formsubmit-browser — kept for existing imports */
export type { FormSubmitResult as FormSubmitClientResult } from "@/lib/formsubmit-browser";
export {
  sendApplicationViaFormSubmitBrowser as sendApplicationViaFormSubmitClient,
  sendContactViaFormSubmitBrowser as sendContactViaFormSubmitClient,
  sendLeadViaFormSubmitBrowser as sendLeadViaFormSubmitClient,
  getFormSubmitActionUrl,
  getFormSubmitRecipient,
  postFormSubmitBrowser,
} from "@/lib/formsubmit-browser";
