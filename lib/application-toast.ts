import { toast } from "sonner";

/** User-facing feedback after an application is saved to the database */
export function toastApplicationSaved(options?: {
  emailSent?: boolean;
  nextStep?: "payment" | "whatsapp";
}) {
  const { emailSent = true, nextStep } = options ?? {};

  if (nextStep === "payment") {
    toast.success("Your application was submitted successfully! Continue to payment.");
  } else if (nextStep === "whatsapp") {
    toast.success("Your application was submitted successfully! Opening WhatsApp…");
  } else {
    toast.success("Your application was submitted successfully!");
  }

  if (!emailSent) {
    toast.error("Application saved, but notification could not be sent. Continue on WhatsApp.");
  }
}

/** After bank transfer + Done on payment modal */
export function toastPaymentComplete(options?: { emailSent?: boolean }) {
  const { emailSent = true } = options ?? {};
  toast.success("Payment recorded! Opening WhatsApp…");
  if (!emailSent) {
    toast.error("Payment saved, but notification could not be sent. Continue on WhatsApp.");
  }
}
