"use server";

import { notifyOwnerOnApplicationSubmit, notifyOwnerOnPayment } from "@/lib/notify-owner";
import {
  createApplicationServer,
  getApplicationServer,
  isServerDemoMode,
  updateApplicationPaymentServer,
} from "@/services/applications.server";
import { uploadApplicationFilesServer } from "@/services/storage.server";
import type {
  Application,
  ApplicationFormData,
  PaymentProvider,
  PaymentStatus,
  PaymentType,
} from "@/types";

export async function submitApplicationAction(
  storageSlug: string,
  serviceName: string,
  form: ApplicationFormData,
  files: File[],
  applicationId: string = crypto.randomUUID()
): Promise<{ application: Application; emailSent: boolean; error?: string }> {
  try {
    const uploaded = await uploadApplicationFilesServer(storageSlug, applicationId, files);
    const application = await createApplicationServer(serviceName, form, uploaded, applicationId);
    const emailSent = await notifyOwnerOnApplicationSubmit(application, files);
    return { application, emailSent };
  } catch (err) {
    return {
      application: {
        id: applicationId,
        service_name: serviceName,
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        country: form.country,
        address: form.address,
        purpose: form.purpose,
        notes: form.notes || null,
        uploaded_files: [],
        payment_status: "pending",
        payment_reference: null,
        created_at: new Date().toISOString(),
      },
      emailSent: false,
      error: err instanceof Error ? err.message : "Submission failed",
    };
  }
}

export async function getApplicationAction(id: string): Promise<Application | null> {
  if (isServerDemoMode()) return null;
  return getApplicationServer(id);
}

export async function updateApplicationPaymentAction(
  id: string,
  payment: {
    reference: string;
    status: PaymentStatus;
    type: PaymentType;
    amount: number;
    provider: PaymentProvider;
  }
): Promise<Application | null> {
  if (isServerDemoMode()) return null;
  return updateApplicationPaymentServer(id, payment);
}

export async function notifyPaymentAction(
  application: Application,
  amount: number,
  files?: File[]
): Promise<boolean> {
  return notifyOwnerOnPayment(application, amount, files);
}
