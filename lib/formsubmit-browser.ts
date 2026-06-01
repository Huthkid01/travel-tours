"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Application, ContactFormData, UploadedFileMeta } from "@/types";

export type FormSubmitResult = { ok: boolean; message?: string };

const DONE_PATH = "/formsubmit-ok";

export function getFormSubmitRecipient(): string {
  return (
    process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_OWNER_EMAIL?.trim() ||
    SITE_CONFIG.email
  );
}

/** Real FormSubmit endpoint — https://formsubmit.co/email (not /ajax/) */
export function getFormSubmitActionUrl(): string {
  const email = getFormSubmitRecipient();
  const accessKey = process.env.NEXT_PUBLIC_FORMSUBMIT_ACCESS_KEY?.trim();
  const base = `https://formsubmit.co/${encodeURIComponent(email)}`;
  return accessKey ? `${base}/${encodeURIComponent(accessKey)}` : base;
}

function activationMessage(): string {
  return "FormSubmit is not activated yet. Submit any form on the live site once, then click the activation link in darboiconsults@gmail.com (check spam).";
}

/**
 * POST via a real HTML <form> in a hidden iframe (browser navigation, no fetch/CORS).
 * @see https://formsubmit.co
 */
export function postFormSubmitBrowser(
  fields: Record<string, string>,
  options?: { timeoutMs?: number }
): Promise<FormSubmitResult> {
  if (typeof document === "undefined") {
    return Promise.resolve({ ok: false, message: "Not in browser" });
  }

  const timeoutMs = options?.timeoutMs ?? 12_000;
  const iframeName = `formsubmit_${Date.now()}`;
  const nextUrl = `${window.location.origin}${DONE_PATH}`;

  const formData: Record<string, string> = {
    _captcha: "false",
    _template: "table",
    _url: window.location.href,
    _next: nextUrl,
    ...fields,
  };

  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.title = "FormSubmit";
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText =
      "position:absolute;width:0;height:0;border:0;opacity:0;pointer-events:none";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = getFormSubmitActionUrl();
    form.target = iframeName;
    form.acceptCharset = "UTF-8";
    form.style.display = "none";

    for (const [key, value] of Object.entries(formData)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    let settled = false;
    const finish = (result: FormSubmitResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      iframe.remove();
      form.remove();
      resolve(result);
    };

    iframe.addEventListener("load", () => {
      try {
        const href = iframe.contentWindow?.location?.href ?? "";
        if (href.includes(DONE_PATH)) {
          finish({ ok: true });
        }
      } catch {
        /* cross-origin until FormSubmit redirects to /formsubmit-ok */
      }
    });

    const timer = window.setTimeout(() => {
      finish({
        ok: true,
        message: "Submitted via FormSubmit (delivery may take a moment).",
      });
    }, timeoutMs);

    document.body.append(iframe, form);
    form.submit();
  });
}

function formatDocumentLinksForEmail(files: UploadedFileMeta[]): string {
  const withUrl = files.filter((f) => f.url && !f.url.startsWith("demo://"));
  if (withUrl.length === 0) return "No files uploaded";
  return withUrl
    .map((f, i) => `${i + 1}. ${f.name}\nOpen / download: ${f.url}`)
    .join("\n\n");
}

export async function sendContactViaFormSubmitBrowser(
  data: ContactFormData
): Promise<FormSubmitResult> {
  return postFormSubmitBrowser({
    _subject: `Contact: ${data.subject}`,
    _replyto: data.email,
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
    form_type: "Contact",
  });
}

export async function sendLeadViaFormSubmitBrowser(data: {
  name: string;
  phone: string;
  email: string;
  interest: string;
}): Promise<FormSubmitResult> {
  return postFormSubmitBrowser({
    _subject: `New lead inquiry: ${data.interest}`,
    _replyto: data.email,
    name: data.name,
    email: data.email,
    phone: data.phone,
    interest: data.interest,
    source: "Website lead popup",
    form_type: "Lead popup",
  });
}

export async function sendApplicationViaFormSubmitBrowser(
  app: Application,
  options?: {
    paymentAmount?: number;
    stage?: "submitted" | "paid";
  }
): Promise<FormSubmitResult> {
  const stage = options?.stage ?? (app.payment_status === "paid" ? "paid" : "submitted");
  const subject =
    stage === "paid"
      ? `Payment received: ${app.service_name}`
      : `New application submitted: ${app.service_name}`;

  const documentLinks = formatDocumentLinksForEmail(app.uploaded_files || []);
  const amountLabel =
    options?.paymentAmount != null ? formatPrice(options.paymentAmount) : "—";

  const fields: Record<string, string> = {
    _subject: subject,
    _replyto: app.email,
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
    uploaded_documents: documentLinks,
    uploaded_files:
      "Open each link in uploaded_documents to view files (Admin dashboard also has copies).",
    status: stage === "paid" ? "Paid" : "Submitted",
    payment_status: app.payment_status,
    payment_reference: app.payment_reference || "—",
    payment_amount: amountLabel,
  };

  const files = app.uploaded_files || [];
  files.forEach((f, i) => {
    if (f.url && !f.url.startsWith("demo://")) {
      fields[`document_${i + 1}_name`] = f.name;
      fields[`document_${i + 1}_link`] = f.url;
    }
  });

  const result = await postFormSubmitBrowser(fields);
  if (!result.ok && !result.message) {
    return { ok: false, message: activationMessage() };
  }
  return result;
}
