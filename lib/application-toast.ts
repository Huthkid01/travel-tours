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
    toast.info(
      "Your details are saved in our system. A copy to Darboi by email is still pending — you can continue on WhatsApp."
    );
  } else if (nextStep !== "whatsapp") {
    toast.info("A copy was sent to Darboi Consults by email.");
  }
}

/** After bank transfer + Done on payment modal */
export function toastPaymentComplete(options?: { emailSent?: boolean }) {
  const { emailSent = true } = options ?? {};
  toast.success("Payment recorded! Opening WhatsApp…");
  if (!emailSent) {
    toast.info(
      "Payment is saved in our system. Email notification to Darboi is pending — continue on WhatsApp."
    );
  } else {
    toast.info("Darboi Consults was notified by email about your payment.");
  }
}
