import "server-only";

import { getOwnerInboxEmail, getSiteUrl, getSmtpUser } from "@/lib/env.server";
import { getAdminSupabase } from "@/supabase/admin";
import type { UploadedFileMeta } from "@/types";
import nodemailer from "nodemailer";

const DOCUMENTS_BUCKET = "documents";
const MAX_ATTACHMENTS = 10;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

export function isGmailSmtpConfigured(): boolean {
  const pass = process.env.GMAIL_APP_PASSWORD?.trim().replace(/\s+/g, "");
  const user = getSmtpUser();
  return Boolean(pass && user.includes("@"));
}

function getGmailAppPassword(): string {
  return process.env.GMAIL_APP_PASSWORD!.trim().replace(/\s+/g, "");
}

function buildHtmlTable(fields: Record<string, string>): string {
  const rows = Object.entries(fields)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:600">${key}</td><td style="padding:8px;border:1px solid #ddd">${value.replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("");
  return `<table style="border-collapse:collapse;width:100%;max-width:640px">${rows}</table>`;
}

export type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

/** Load application uploads from Supabase storage or signed URLs for email attachments */
export async function fetchApplicationAttachments(
  files: UploadedFileMeta[]
): Promise<MailAttachment[]> {
  const attachments: MailAttachment[] = [];
  let totalBytes = 0;

  for (const file of files) {
    if (attachments.length >= MAX_ATTACHMENTS) break;
    if (!file.url || file.url.startsWith("demo://")) continue;

    let buffer: Buffer | null = null;

    if (file.path) {
      const supabase = getAdminSupabase();
      if (supabase) {
        const { data, error } = await supabase.storage
          .from(DOCUMENTS_BUCKET)
          .download(file.path);
        if (!error && data) {
          buffer = Buffer.from(await data.arrayBuffer());
        }
      }
    }

    if (!buffer) {
      try {
        const res = await fetch(file.url, { signal: AbortSignal.timeout(30_000) });
        if (res.ok) {
          buffer = Buffer.from(await res.arrayBuffer());
        }
      } catch {
        /* skip unreachable file */
      }
    }

    if (!buffer || buffer.length === 0) continue;
    if (totalBytes + buffer.length > MAX_TOTAL_BYTES) break;

    totalBytes += buffer.length;
    attachments.push({
      filename: file.name || "document",
      content: buffer,
      contentType: file.type || undefined,
    });
  }

  return attachments;
}

/** Send form details via Gmail SMTP (Nodemailer) */
export async function sendOwnerMailViaGmail(options: {
  subject: string;
  replyTo?: string;
  fields: Record<string, string>;
  attachments?: MailAttachment[];
}): Promise<void> {
  if (!isGmailSmtpConfigured()) {
    throw new Error(
      "Gmail is not configured. Set SMTP_USER, GMAIL_APP_PASSWORD, and OWNER_INBOX_EMAIL in Vercel."
    );
  }

  const user = getSmtpUser();
  const pass = getGmailAppPassword();
  const to = getOwnerInboxEmail();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const text = Object.entries(options.fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const attachmentNote =
    options.attachments && options.attachments.length > 0
      ? `<p><strong>${options.attachments.length} file(s) attached</strong> (images/PDFs from the application).</p>`
      : "";

  await transport.sendMail({
    from: `"Darboi Consults Website" <${user}>`,
    to,
    replyTo: options.replyTo || user,
    subject: options.subject,
    text,
    html: `<p>New submission from <a href="${getSiteUrl()}">${getSiteUrl()}</a></p>${attachmentNote}${buildHtmlTable(options.fields)}`,
    attachments: options.attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
      contentType: a.contentType,
    })),
  });
}
