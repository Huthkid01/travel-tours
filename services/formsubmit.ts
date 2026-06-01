import "server-only";

import { isOwnerEmailConfigured } from "@/lib/env.server";
import { formatPrice } from "@/lib/utils";
import { fetchApplicationAttachments, sendOwnerEmail } from "@/services/owner-email";
import type { Application, ContactFormData } from "@/types";

/** Contact form → owner inbox (Gmail) */
export async function sendContactForm(data: ContactFormData): Promise<void> {
  if (!isOwnerEmailConfigured()) {
    console.log("[owner-email demo] Contact:", data);
    return;
  }

  await sendOwnerEmail({
    subject: `Contact: ${data.subject}`,
    replyTo: data.email,
    fields: {
      form_type: "Contact",
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    },
  });
}

export type ApplicationEmailStage = "submitted" | "paid";

function applicationFields(
  app: Application,
  options?: { paymentAmount?: string | number; stage?: ApplicationEmailStage }
): Record<string, string> {
  const stage = options?.stage ?? (app.payment_status === "paid" ? "paid" : "submitted");
  const fileLinks = (app.uploaded_files || [])
    .filter((f) => f.url && !f.url.startsWith("demo://"))
    .map((f, i) => `${i + 1}. ${f.name}: ${f.url}`)
    .join("\n");
  const amountLabel =
    options?.paymentAmount != null
      ? typeof options.paymentAmount === "number"
        ? formatPrice(options.paymentAmount)
        : options.paymentAmount
      : "—";

  return {
    form_type: "Application",
    application_id: app.id,
    service: app.service_name,
    full_name: app.full_name,
    email: app.email,
    phone: app.phone,
    country: app.country,
    address: app.address,
    purpose: app.purpose,
    notes: app.notes || "—",
    uploaded_files: fileLinks || "No files uploaded",
    status: stage === "paid" ? "Paid" : "Submitted",
    payment_status: app.payment_status,
    payment_reference: app.payment_reference || "—",
    payment_amount: amountLabel,
  };
}

/** Application notification — includes file attachments when available */
export async function sendApplicationForm(
  app: Application,
  options?: {
    paymentAmount?: string | number;
    stage?: ApplicationEmailStage;
  }
): Promise<void> {
  if (!isOwnerEmailConfigured()) {
    console.log("[owner-email demo] Application:", app, options?.stage ?? "submitted");
    return;
  }

  const stage = options?.stage ?? (app.payment_status === "paid" ? "paid" : "submitted");
  const subject =
    stage === "paid"
      ? `Payment received: ${app.service_name}`
      : `New application submitted: ${app.service_name}`;

  const attachments = await fetchApplicationAttachments(app.uploaded_files || []);
  const fields = applicationFields(app, options);
  if (attachments.length > 0) {
    fields.attachments_in_email = `${attachments.length} file(s) attached to this email`;
  }

  await sendOwnerEmail({
    subject,
    replyTo: app.email,
    fields,
    attachments,
  });
}

export interface LeadFormData {
  name: string;
  phone: string;
  email: string;
  interest: string;
}

/** Lead popup → owner inbox (Gmail) */
export async function sendLeadForm(data: LeadFormData): Promise<void> {
  if (!isOwnerEmailConfigured()) {
    console.log("[owner-email demo] Lead:", data);
    return;
  }

  await sendOwnerEmail({
    subject: `New lead inquiry: ${data.interest}`,
    replyTo: data.email,
    fields: {
      form_type: "Lead popup",
      name: data.name,
      email: data.email,
      phone: data.phone,
      interest: data.interest,
      source: "Website lead popup",
    },
  });
}
