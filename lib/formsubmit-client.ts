"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Application, ContactFormData, UploadedFileMeta } from "@/types";

export type FormSubmitClientResult = { ok: boolean; message?: string };

function getFormSubmitRecipient(): string {
  return (
    process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_OWNER_EMAIL?.trim() ||
    SITE_CONFIG.email
  );
}

function getFormSubmitAjaxUrl(): string {
  const email = encodeURIComponent(getFormSubmitRecipient());
  const accessKey = process.env.NEXT_PUBLIC_FORMSUBMIT_ACCESS_KEY?.trim();
  if (accessKey) {
    return `https://formsubmit.co/ajax/${email}/${encodeURIComponent(accessKey)}`;
  }
  return `https://formsubmit.co/ajax/${email}`;
}

/** Browser → FormSubmit AJAX (must be activated once on your live domain) */
async function postFormSubmitClient(formData: FormData): Promise<FormSubmitClientResult> {
  formData.append("_url", typeof window !== "undefined" ? window.location.href : SITE_CONFIG.url);

  try {
    const res = await fetch(getFormSubmitAjaxUrl(), {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    const json = (await res.json().catch(() => ({}))) as {
      success?: string | boolean;
      message?: string;
    };

    const msg = (json.message || "").toLowerCase();
    const ok =
      res.ok &&
      (json.success === "true" ||
        json.success === true ||
        msg.includes("thank") ||
        (res.status === 200 && !msg.includes("fail") && !msg.includes("error")));

    if (!ok) {
      const raw = json.message || `FormSubmit failed (${res.status})`;
      if (/activat/i.test(raw)) {
        return {
          ok: false,
          message:
            "FormSubmit is not activated yet. Open the live site Contact page, submit once, then click the link in darboiconsults@gmail.com (check spam).",
        };
      }
      if (res.status === 403) {
        return {
          ok: false,
          message:
            "FormSubmit blocked this request. Use the live site (not localhost preview), or set GMAIL_APP_PASSWORD on Vercel for backup email.",
        };
      }
      return { ok: false, message: raw };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Could not reach FormSubmit",
    };
  }
}

export async function sendContactViaFormSubmitClient(
  data: ContactFormData
): Promise<FormSubmitClientResult> {
  const formData = new FormData();
  formData.append("_subject", `Contact: ${data.subject}`);
  formData.append("_captcha", "false");
  formData.append("_template", "table");
  formData.append("_replyto", data.email);
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("subject", data.subject);
  formData.append("message", data.message);
  return postFormSubmitClient(formData);
}

export async function sendLeadViaFormSubmitClient(data: {
  name: string;
  phone: string;
  email: string;
  interest: string;
}): Promise<FormSubmitClientResult> {
  const formData = new FormData();
  formData.append("_subject", `New lead inquiry: ${data.interest}`);
  formData.append("_captcha", "false");
  formData.append("_template", "table");
  formData.append("_replyto", data.email);
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("interest", data.interest);
  formData.append("source", "Website lead popup");
  return postFormSubmitClient(formData);
}

function formatDocumentLinksForEmail(files: UploadedFileMeta[]): string {
  const withUrl = files.filter((f) => f.url && !f.url.startsWith("demo://"));
  if (withUrl.length === 0) return "No files uploaded";
  return withUrl
    .map((f, i) => `${i + 1}. ${f.name}\nOpen / download: ${f.url}`)
    .join("\n\n");
}

export async function sendApplicationViaFormSubmitClient(
  app: Application,
  options?: {
    paymentAmount?: number;
    stage?: "submitted" | "paid";
  }
): Promise<FormSubmitClientResult> {
  const stage = options?.stage ?? (app.payment_status === "paid" ? "paid" : "submitted");
  const subject =
    stage === "paid"
      ? `Payment received: ${app.service_name}`
      : `New application submitted: ${app.service_name}`;

  const documentLinks = formatDocumentLinksForEmail(app.uploaded_files || []);
  const amountLabel =
    options?.paymentAmount != null ? formatPrice(options.paymentAmount) : "—";

  const formData = new FormData();
  formData.append("_subject", subject);
  formData.append("_captcha", "false");
  formData.append("_template", "table");
  formData.append("_replyto", app.email);
  formData.append("application_id", app.id);
  formData.append("service", app.service_name);
  formData.append("full_name", app.full_name);
  formData.append("email", app.email);
  formData.append("phone", app.phone);
  formData.append("country", app.country);
  formData.append("address", app.address);
  formData.append("purpose", app.purpose);
  formData.append("notes", app.notes || "—");
  formData.append("uploaded_documents", documentLinks);
  formData.append(
    "uploaded_files",
    "Use the links in uploaded_documents to view each file (open in browser for preview)."
  );
  formData.append("status", stage === "paid" ? "Paid" : "Submitted");
  formData.append("payment_status", app.payment_status);
  formData.append("payment_reference", app.payment_reference || "—");
  formData.append("payment_amount", amountLabel);

  const files = app.uploaded_files || [];
  files.forEach((f, i) => {
    if (f.url && !f.url.startsWith("demo://")) {
      formData.append(`document_${i + 1}_name`, f.name);
      formData.append(`document_${i + 1}_link`, f.url);
    }
  });

  return postFormSubmitClient(formData);
}
