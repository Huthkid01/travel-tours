import "server-only";

import { isFormSubmitServerConfigured } from "@/lib/env.server";
import { formatPrice } from "@/lib/utils";
import { sendOwnerEmail } from "@/services/owner-email";
import type { Application, ContactFormData } from "@/types";

/** Contact form → owner inbox (server: Gmail preferred) */
export async function sendContactForm(data: ContactFormData): Promise<void> {
  if (!isFormSubmitServerConfigured()) {
    console.log("[owner-email demo] Contact:", data);
    return;
  }

  const fields: Record<string, string> = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
  };

  const formData = new FormData();
  formData.append("_subject", `Contact: ${data.subject}`);
  formData.append("_captcha", "false");
  formData.append("_template", "table");
  formData.append("_replyto", data.email);
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }

  await sendOwnerEmail({
    subject: `Contact: ${data.subject}`,
    replyTo: data.email,
    fields,
    formData,
  });
}

export type ApplicationEmailStage = "submitted" | "paid";

function applicationFields(
  app: Application,
  options?: { paymentAmount?: string | number; stage?: ApplicationEmailStage }
): Record<string, string> {
  const stage = options?.stage ?? (app.payment_status === "paid" ? "paid" : "submitted");
  const fileLinks = (app.uploaded_files || [])
    .map((f, i) => `${i + 1}. ${f.name}: ${f.url}`)
    .join("\n");
  const amountLabel =
    options?.paymentAmount != null
      ? typeof options.paymentAmount === "number"
        ? formatPrice(options.paymentAmount)
        : options.paymentAmount
      : "—";

  return {
    application_id: app.id,
    service: app.service_name,
    full_name: app.full_name,
    email: app.email,
    phone: app.phone,
    country: app.country,
    address: app.address,
    purpose: app.purpose,
    notes: app.notes || "—",
    uploaded_files: fileLinks || "No files (see Admin dashboard)",
    status: stage === "paid" ? "Paid" : "Submitted — payment pending",
    payment_status: app.payment_status,
    payment_reference: app.payment_reference || "—",
    payment_amount: amountLabel,
  };
}

/** Application notification — on submit and after payment */
export async function sendApplicationForm(
  app: Application,
  options?: {
    paymentAmount?: string | number;
    stage?: ApplicationEmailStage;
  }
): Promise<void> {
  if (!isFormSubmitServerConfigured()) {
    console.log("[owner-email demo] Application:", app, options?.stage ?? "submitted");
    return;
  }

  const stage = options?.stage ?? (app.payment_status === "paid" ? "paid" : "submitted");
  const subject =
    stage === "paid"
      ? `Payment received: ${app.service_name}`
      : `New application submitted: ${app.service_name}`;

  const fields = applicationFields(app, options);
  const formData = new FormData();
  formData.append("_subject", subject);
  formData.append("_captcha", "false");
  formData.append("_template", "table");
  formData.append("_replyto", app.email);
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }

  await sendOwnerEmail({
    subject,
    replyTo: app.email,
    fields,
    formData,
  });
}

export interface LeadFormData {
  name: string;
  phone: string;
  email: string;
  interest: string;
}

/** Lead popup → owner inbox */
export async function sendLeadForm(data: LeadFormData): Promise<void> {
  if (!isFormSubmitServerConfigured()) {
    console.log("[owner-email demo] Lead:", data);
    return;
  }

  const fields: Record<string, string> = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    interest: data.interest,
    source: "Website lead popup",
  };

  const formData = new FormData();
  formData.append("_subject", `New lead inquiry: ${data.interest}`);
  formData.append("_captcha", "false");
  formData.append("_template", "table");
  formData.append("_replyto", data.email);
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }

  await sendOwnerEmail({
    subject: `New lead inquiry: ${data.interest}`,
    replyTo: data.email,
    fields,
    formData,
  });
}
