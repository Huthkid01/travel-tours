import { notifyOwnerOnApplicationSubmit, notifyOwnerOnPayment } from "@/lib/notify-owner";
import { submitContactAction } from "@/lib/actions/contact";
import type { Application, ContactFormData } from "@/types";

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const result = await submitContactAction(data);
  if (!result.ok) throw new Error(result.error || "Failed to send message");
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
