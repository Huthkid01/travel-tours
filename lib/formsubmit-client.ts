"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Application, ContactFormData } from "@/types";

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

/** Resolve files for FormSubmit — prefer in-memory uploads; else fetch from storage URLs */
async function resolveApplicationFiles(
  app: Application,
  localFiles?: File[]
): Promise<File[]> {
  if (localFiles?.length) {
    return localFiles.filter((f) => f.size > 0);
  }

  const resolved: File[] = [];
  for (const meta of app.uploaded_files || []) {
    if (!meta.url || meta.url.startsWith("demo://")) continue;
    try {
      const res = await fetch(meta.url);
      if (!res.ok) continue;
      const blob = await res.blob();
      resolved.push(
        new File([blob], meta.name, { type: meta.type || blob.type || "application/octet-stream" })
      );
    } catch {
      /* skip unreachable file */
    }
  }
  return resolved;
}

function appendFilesToFormData(formData: FormData, files: File[]) {
  files.forEach((file, i) => {
    const key =
      file.name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/^_+/, "") || `document_${i + 1}`;
    formData.append(key, file, file.name);
  });
}

export async function sendApplicationViaFormSubmitClient(
  app: Application,
  options?: {
    paymentAmount?: number;
    stage?: "submitted" | "paid";
    /** Original uploads — attached to email (like native FormSubmit file fields) */
    files?: File[];
  }
): Promise<FormSubmitClientResult> {
  const stage = options?.stage ?? (app.payment_status === "paid" ? "paid" : "submitted");
  const subject =
    stage === "paid"
      ? `Payment received: ${app.service_name}`
      : `New application submitted: ${app.service_name}`;

  const attachmentFiles = await resolveApplicationFiles(app, options?.files);
  const fileNames =
    attachmentFiles.length > 0
      ? attachmentFiles.map((f) => f.name).join(", ")
      : (app.uploaded_files || []).map((f) => f.name).join(", ") || "None";

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
  formData.append(
    "uploaded_files",
    attachmentFiles.length > 0
      ? `${fileNames} (attached to this email)`
      : fileNames || "See admin dashboard"
  );
  formData.append("status", stage === "paid" ? "Paid" : "Submitted");
  formData.append("payment_status", app.payment_status);
  formData.append("payment_reference", app.payment_reference || "—");
  formData.append("payment_amount", amountLabel);

  appendFilesToFormData(formData, attachmentFiles);

  return postFormSubmitClient(formData);
}
