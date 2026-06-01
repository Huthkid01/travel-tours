import "server-only";

import { getOwnerInboxEmail, isOwnerEmailConfigured } from "@/lib/env.server";
import {
  fetchApplicationAttachments,
  isGmailSmtpConfigured,
  sendOwnerMailViaGmail,
  type MailAttachment,
} from "@/services/owner-mail-fallback";

export type OwnerEmailMethod = "gmail";

export type OwnerEmailResult = {
  method: OwnerEmailMethod;
};

/** Send owner notification from the server via Gmail (Nodemailer) */
export async function sendOwnerEmail(options: {
  subject: string;
  replyTo?: string;
  fields: Record<string, string>;
  attachments?: MailAttachment[];
}): Promise<OwnerEmailResult> {
  if (!isGmailSmtpConfigured()) {
    throw new Error(
      "Gmail is not configured. Set SMTP_USER, GMAIL_APP_PASSWORD, and OWNER_INBOX_EMAIL in Vercel, then redeploy."
    );
  }

  await sendOwnerMailViaGmail(options);
  return { method: "gmail" };
}

export { fetchApplicationAttachments };

export function getOwnerEmailSetupHint(): string {
  if (isOwnerEmailConfigured()) {
    return `Form emails send from ${process.env.SMTP_USER} to ${getOwnerInboxEmail()} via Gmail.`;
  }
  return `Set SMTP_USER, GMAIL_APP_PASSWORD, and OWNER_INBOX_EMAIL in Vercel.`;
}
