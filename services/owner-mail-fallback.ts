import "server-only";

import { getFormSubmitEmail, getSiteUrl } from "@/lib/env.server";
import nodemailer from "nodemailer";

export function isGmailSmtpConfigured(): boolean {
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();
  const user = process.env.SMTP_USER?.trim() || getFormSubmitEmail();
  return Boolean(pass && user?.includes("@"));
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

/** Direct Gmail delivery when FormSubmit is blocked or not activated */
export async function sendOwnerMailViaGmail(options: {
  subject: string;
  replyTo?: string;
  fields: Record<string, string>;
}): Promise<void> {
  if (!isGmailSmtpConfigured()) {
    throw new Error("Gmail SMTP is not configured (set GMAIL_APP_PASSWORD in Vercel).");
  }

  const user = process.env.SMTP_USER?.trim() || getFormSubmitEmail();
  const pass = process.env.GMAIL_APP_PASSWORD!.trim();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const text = Object.entries(options.fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  await transport.sendMail({
    from: `"Darboi Consults Website" <${user}>`,
    to: getFormSubmitEmail(),
    replyTo: options.replyTo || user,
    subject: options.subject,
    text,
    html: `<p>New submission from <a href="${getSiteUrl()}">${getSiteUrl()}</a></p>${buildHtmlTable(options.fields)}`,
  });
}
