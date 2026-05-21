import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG, isEmailJsConfigured, SITE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Application, ContactFormData, EmailApplicationPayload } from "@/types";

function buildApplicationPayload(app: Application, paymentAmount?: number): EmailApplicationPayload {
  const fileLinks = (app.uploaded_files || [])
    .map((f, i) => `${i + 1}. ${f.name}: ${f.url}`)
    .join("\n");

  return {
    applicationId: app.id,
    serviceName: app.service_name,
    customerName: app.full_name,
    email: app.email,
    phone: app.phone,
    country: app.country,
    address: app.address,
    purpose: app.purpose,
    notes: app.notes || "—",
    fileLinks: fileLinks || "No files uploaded",
    paymentReference: app.payment_reference || "Pending",
    paymentStatus: app.payment_status,
    paymentAmount: paymentAmount ? formatPrice(paymentAmount) : "—",
    timestamp: new Date(app.created_at).toLocaleString("en-NG"),
  };
}

export async function sendApplicationEmail(app: Application, paymentAmount?: number): Promise<void> {
  const payload = buildApplicationPayload(app, paymentAmount);

  if (!isEmailJsConfigured()) {
    console.log("[EmailJS Demo] Application notification:", payload);
    return;
  }

  await emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    {
      to_email: EMAILJS_CONFIG.adminEmail,
      from_name: SITE_CONFIG.name,
      reply_to: app.email,
      ...payload,
      // Template-friendly aliases
      service_name: payload.serviceName,
      full_name: payload.customerName,
      customer_email: payload.email,
      customer_phone: payload.phone,
      uploaded_files: payload.fileLinks,
      payment_reference: payload.paymentReference,
      payment_status: payload.paymentStatus,
      application_id: payload.applicationId,
    },
    EMAILJS_CONFIG.publicKey
  );
}

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  if (!isEmailJsConfigured()) {
    console.log("[EmailJS Demo] Contact message:", data);
    return;
  }

  await emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.contactTemplateId,
    {
      to_email: EMAILJS_CONFIG.adminEmail,
      from_name: data.name,
      reply_to: data.email,
      customer_name: data.name,
      customer_email: data.email,
      customer_phone: data.phone,
      subject: data.subject,
      message: data.message,
    },
    EMAILJS_CONFIG.publicKey
  );
}
