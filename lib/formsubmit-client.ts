"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Application, ContactFormData, UploadedFileMeta } from "@/types";

export type FormSubmitClientResult = { ok: boolean; message?: string };

/** Browser → https://formsubmit.co/ajax/darboiconsults@gmail.com (works; server/Vercel gets 403) */
async function postFormSubmitClient(formData: FormData): Promise<FormSubmitClientResult> {
  const recipient = encodeURIComponent(SITE_CONFIG.email);

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
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
            "Check darboiconsults@gmail.com (and spam) for FormSubmit’s activation email and click the link — required once.",
        };
      }
      if (res.status === 403) {
        return {
          ok: false,
          message: "FormSubmit blocked this request. Try again from Chrome on the live site, not an embedded preview.",
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

/** Clickable document links for the owner email (attachments often lack preview in inbox) */
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
    /** @deprecated Files are not attached — links from app.uploaded_files are used instead */
    files?: File[];
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
