"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Application, ContactFormData, UploadedFileMeta } from "@/types";

export type FormSubmitResult = { ok: boolean; message?: string };

const DONE_PATH = "/formsubmit-ok";
const MESSAGE_TYPE = "formsubmit:success";

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
  const base = `https://formsubmit.co/${email}`;
  return accessKey ? `${base}/${accessKey}` : base;
}

function activationMessage(): string {
  return "FormSubmit is not activated yet. Submit once on the live site, then click the activation link in darboiconsults@gmail.com (check spam).";
}

/**
 * POST with a real HTML form in a popup window (top-level navigation).
 * FormSubmit blocks iframes (X-Frame-Options: sameorigin) — do not use hidden iframe.
 */
export function postFormSubmitBrowser(
  fields: Record<string, string>,
  options?: { timeoutMs?: number }
): Promise<FormSubmitResult> {
  if (typeof document === "undefined") {
    return Promise.resolve({ ok: false, message: "Not in browser" });
  }

  const timeoutMs = options?.timeoutMs ?? 90_000;
  const nextUrl = `${window.location.origin}${DONE_PATH}`;
  const popupName = `formsubmit_${Date.now()}`;

  const formData: Record<string, string> = {
    _captcha: "false",
    _template: "table",
    _url: window.location.href,
    _next: nextUrl,
    ...fields,
  };

  return new Promise((resolve) => {
    let settled = false;
    let popup: Window | null = null;

    const finish = (result: FormSubmitResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      window.removeEventListener("message", onMessage);
      form.remove();
      try {
        if (popup && !popup.closed) popup.close();
      } catch {
        /* ignore */
      }
      resolve(result);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === MESSAGE_TYPE) {
        finish({ ok: true });
      }
    };

    window.addEventListener("message", onMessage);

    popup = window.open("about:blank", popupName, "popup=yes,width=480,height=360");

    if (!popup) {
      finish({
        ok: false,
        message:
          "Could not open FormSubmit window. Allow popups for this site, then try again.",
      });
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = getFormSubmitActionUrl();
    form.target = popupName;
    form.acceptCharset = "UTF-8";
    form.style.display = "none";

    for (const [key, value] of Object.entries(formData)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    const timer = window.setTimeout(() => {
      finish({
        ok: false,
        message: `${activationMessage()} If a popup opened, complete any step there and allow popups.`,
      });
    }, timeoutMs);

    document.body.append(form);
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

  return postFormSubmitBrowser(fields);
}
