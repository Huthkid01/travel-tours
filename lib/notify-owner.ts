import { sendApplicationForm } from "@/services/formsubmit";
import type { Application } from "@/types";

/** Email owner when a form is submitted (does not throw — logs on failure) */
export async function notifyOwnerOnApplicationSubmit(
  application: Application,
  files?: File[]
): Promise<boolean> {
  try {
    await sendApplicationForm(application, { files, stage: "submitted" });
    return true;
  } catch (err) {
    console.error("[notifyOwnerOnApplicationSubmit]", err);
    return false;
  }
}

/** Email owner when payment is completed */
export async function notifyOwnerOnPayment(
  application: Application,
  paymentAmount: number,
  files?: File[]
): Promise<boolean> {
  try {
    await sendApplicationForm(application, { files, paymentAmount, stage: "paid" });
    return true;
  } catch (err) {
    console.error("[notifyOwnerOnPayment]", err);
    return false;
  }
}
