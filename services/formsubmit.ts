import "server-only";

import { getFormSubmitEmail, isFormSubmitServerConfigured } from "@/lib/env.server";

function getFormSubmitAccessKey(): string | undefined {
  return process.env.FORMSUBMIT_ACCESS_KEY?.trim() || undefined;
}
import { formatPrice } from "@/lib/utils";
import type { Application, ContactFormData } from "@/types";

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax";

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
    headers: { Accept: "application/json" },
  });

  const json = (await res.json().catch(() => ({}))) as {
    success?: string | boolean;
    message?: string;
  };

  const ok =
    res.ok &&
    (json.success === "true" ||
      json.success === true ||
      (res.status === 200 && !json.message?.toLowerCase().includes("fail")));

  if (!ok) {
    const msg = json.message || "FormSubmit request failed";
    if (/activat/i.test(msg)) {
      throw new Error(
        "FormSubmit email is not activated yet. Open the activation link FormSubmit sent to your inbox."
      );
    }
    throw new Error(msg);
  }
}

/** Contact form → client inbox via FormSubmit */
export async function sendContactForm(data: ContactFormData): Promise<void> {
  if (!isFormSubmitServerConfigured()) {
    console.log("[FormSubmit Demo] Contact:", data);
    return;
  }

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

  await postFormSubmit(formData);
}

export type ApplicationEmailStage = "submitted" | "paid";

/** Application notification — on submit and after payment */
export async function sendApplicationForm(
  app: Application,
  options?: {
    files?: File[];
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

  const fileLinks = (app.uploaded_files || [])
    .map((f, i) => `${i + 1}. ${f.name}: ${f.url}`)
    .join("\n");

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
  formData.append("uploaded_files", fileLinks || "No files");
  formData.append("status", stage === "paid" ? "Paid" : "Submitted — payment pending");
  formData.append("payment_status", app.payment_status);
  formData.append("payment_reference", app.payment_reference || "—");
  const amountLabel =
    options?.paymentAmount != null
      ? typeof options.paymentAmount === "number"
        ? formatPrice(options.paymentAmount)
        : options.paymentAmount
      : "—";
  formData.append("payment_amount", amountLabel);

  options?.files?.forEach((file, i) => {
    formData.append(`attachment_${i + 1}`, file, file.name);
  });

  await postFormSubmit(formData);
}
