/** Notifications via FormSubmit — EmailJS removed per client preference */
import { notifyOwnerOnApplicationSubmit, notifyOwnerOnPayment } from "@/lib/notify-owner";
import { sendContactForm } from "@/services/formsubmit";
import type { Application, ContactFormData } from "@/types";

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  return sendContactForm(data);
}

export async function sendApplicationEmail(app: Application, paymentAmount?: number): Promise<void> {
  if (paymentAmount != null) {
    const ok = await notifyOwnerOnPayment(app, paymentAmount);
    if (!ok) throw new Error("Payment notification email failed");
    return;
  }
  const ok = await notifyOwnerOnApplicationSubmit(app);
  if (!ok) throw new Error("Application notification email failed");
}
