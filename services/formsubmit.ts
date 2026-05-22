import "server-only";

import { getFormSubmitEmail, getSiteUrl, isFormSubmitServerConfigured } from "@/lib/env.server";
import { formatPrice } from "@/lib/utils";
import { isGmailSmtpConfigured, sendOwnerMailViaGmail } from "@/services/owner-mail-fallback";
import type { Application, ContactFormData } from "@/types";

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax";

function getFormSubmitAccessKey(): string | undefined {
  return process.env.FORMSUBMIT_ACCESS_KEY?.trim() || undefined;
}

function getRecipientEmail(): string {
  return getFormSubmitEmail();
}

async function postFormSubmit(formData: FormData): Promise<void> {
  const email = encodeURIComponent(getRecipientEmail());
  const accessKey = getFormSubmitAccessKey();
  const endpoint = accessKey
    ? `${FORMSUBMIT_ENDPOINT}/${email}/${encodeURIComponent(accessKey)}`
    : `${FORMSUBMIT_ENDPOINT}/${email}`;

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      Referer: getSiteUrl(),
    },
  });

  const json = (await res.json().catch(() => ({}))) as {
    success?: string | boolean;
    message?: string;
  };

  const message = (json.message || "").toLowerCase();
  const ok =
    res.ok &&
    (json.success === "true" ||
      json.success === true ||
      message.includes("thank") ||
      (res.status === 200 && !message.includes("fail") && !message.includes("error")));

  if (!ok) {
    const msg = json.message || `FormSubmit request failed (${res.status})`;
    if (/activat/i.test(msg)) {
      throw new Error(
        "FormSubmit inbox not activated. Check darboiconsults@gmail.com for FormSubmit confirmation link and click it."
      );
    }
    throw new Error(msg);
  }
}

async function deliverOwnerEmail(
  subject: string,
  replyTo: string | undefined,
  fields: Record<string, string>,
  formData: FormData
): Promise<"formsubmit" | "gmail"> {
  try {
    await postFormSubmit(formData);
    return "formsubmit";
  } catch (formSubmitErr) {
    console.error("[FormSubmit]", formSubmitErr);
    if (!isGmailSmtpConfigured()) throw formSubmitErr;
    await sendOwnerMailViaGmail({ subject, replyTo, fields });
    return "gmail";
  }
}

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

/** Contact form → owner inbox */
export async function sendContactForm(data: ContactFormData): Promise<void> {
  if (!isFormSubmitServerConfigured()) {
    console.log("[FormSubmit Demo] Contact:", data);
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

  await deliverOwnerEmail(`Contact: ${data.subject}`, data.email, fields, formData);
}

export type ApplicationEmailStage = "submitted" | "paid";

/** Application notification — on submit and after payment (file links only, no attachments) */
export async function sendApplicationForm(
  app: Application,
  options?: {
    paymentAmount?: string | number;
    stage?: ApplicationEmailStage;
  }
): Promise<void> {
  if (!isFormSubmitServerConfigured()) {
    console.log("[FormSubmit Demo] Application:", app, options?.stage ?? "submitted");
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

  await deliverOwnerEmail(subject, app.email, fields, formData);
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
    console.log("[FormSubmit Demo] Lead:", data);
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

  await deliverOwnerEmail(`New lead inquiry: ${data.interest}`, data.email, fields, formData);
}
