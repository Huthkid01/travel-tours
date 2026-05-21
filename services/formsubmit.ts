import { SITE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Application, ContactFormData } from "@/types";

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax";

function getRecipientEmail(): string {
  return (
    process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    SITE_CONFIG.email
  );
}

function isFormSubmitConfigured(): boolean {
  const email = getRecipientEmail();
  return Boolean(email && email.includes("@"));
}

async function postFormSubmit(formData: FormData): Promise<void> {
  const email = encodeURIComponent(getRecipientEmail());
  const res = await fetch(`${FORMSUBMIT_ENDPOINT}/${email}`, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  });

  const json = (await res.json().catch(() => ({}))) as { success?: string; message?: string };

  if (!res.ok || json.success !== "true") {
    throw new Error(json.message || "FormSubmit request failed");
  }
}

/** Contact form → client inbox via FormSubmit (no EmailJS) */
export async function sendContactForm(data: ContactFormData): Promise<void> {
  if (!isFormSubmitConfigured()) {
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
  if (!isFormSubmitConfigured()) {
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

export { isFormSubmitConfigured };
