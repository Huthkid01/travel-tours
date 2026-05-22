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
      "Your details are saved in our system. An email copy to Darboi is optional — you can continue on WhatsApp."
    );
  }
}
