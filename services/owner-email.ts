import "server-only";

import { getFormSubmitEmail } from "@/lib/env.server";
import { isGmailSmtpConfigured, sendOwnerMailViaGmail } from "@/services/owner-mail-fallback";
import { postFormSubmitServer } from "@/services/formsubmit-server";

export type OwnerEmailMethod = "gmail" | "formsubmit";

export type OwnerEmailResult = {
  method: OwnerEmailMethod;
};

/**
 * Send owner notification from the server.
 * Gmail first (works on Vercel). FormSubmit server/ajax often returns 403 from datacenters.
 */
export async function sendOwnerEmail(options: {
  subject: string;
  replyTo?: string;
  fields: Record<string, string>;
  formData: FormData;
}): Promise<OwnerEmailResult> {
  if (isGmailSmtpConfigured()) {
    await sendOwnerMailViaGmail({
      subject: options.subject,
      replyTo: options.replyTo,
      fields: options.fields,
    });
    return { method: "gmail" };
  }

  try {
    await postFormSubmitServer(options.formData);
    return { method: "formsubmit" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Email failed";
    throw new Error(
      `${msg} — Add GMAIL_APP_PASSWORD in Vercel (Google App Password) and redeploy. FormSubmit does not work reliably from the server.`
    );
  }
}

export function getOwnerEmailSetupHint(): string {
  if (isGmailSmtpConfigured()) {
    return `Emails send via Gmail to ${getFormSubmitEmail()}.`;
  }
  return `Set GMAIL_APP_PASSWORD in Vercel for ${getFormSubmitEmail()}. FormSubmit from the server is blocked (403); use the contact form in a browser once to activate FormSubmit, or use Gmail.`;
}
