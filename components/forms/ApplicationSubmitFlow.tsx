"use client";

import { usePaymentSettings } from "@/components/forms/usePaymentSettings";
import { PaymentDetailsModal } from "@/components/payment/PaymentDetailsModal";
import { toastApplicationSaved, toastPaymentComplete } from "@/lib/application-toast";
import { sendApplicationViaFormSubmitClient } from "@/lib/formsubmit-client";
import { submitApplicationViaApi } from "@/lib/submit-application-client";
import { getApplicationWhatsAppMessage, redirectToWhatsApp } from "@/lib/whatsapp";
import type { PaymentSettings } from "@/data/payment-settings-default";
import type { Application, ApplicationFormData } from "@/types";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

interface PendingSubmission {
  form: ApplicationFormData;
  files: File[];
  applicationId: string;
}

interface ApplicationSubmitFlowProps {
  storageSlug: string;
  serviceName: string;
  kind?: "program" | "service" | "consultation";
  paymentSettings?: PaymentSettings;
  /** Step 5 = Make payment → modal → submit + email + WhatsApp after "I've made payment" */
  submitAfterPayment?: boolean;
  children: (props: {
    onSubmit: (data: ApplicationFormData, files: File[]) => Promise<void>;
    onStageForPayment: (data: ApplicationFormData, files: File[]) => void;
    submitLabel: string;
    deferPaymentToModal: boolean;
    paymentStepOpensModal: boolean;
    disabled: boolean;
  }) => ReactNode;
}

export function ApplicationSubmitFlow({
  storageSlug,
  serviceName,
  kind = "service",
  paymentSettings: paymentSettingsOverride,
  submitAfterPayment = false,
  children,
}: ApplicationSubmitFlowProps) {
  const [submitted, setSubmitted] = useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pendingRef = useRef<PendingSubmission | null>(null);
  const { settings: liveSettings } = usePaymentSettings();
  const settings = paymentSettingsOverride ?? liveSettings;

  const emailOwnerViaFormSubmit = async (
    app: Application,
    stage: "submitted" | "paid",
    paymentAmount?: number
  ): Promise<boolean> => {
    const result = await sendApplicationViaFormSubmitClient(app, {
      stage,
      paymentAmount,
    });
    if (!result.ok) {
      toast.error(
        result.message ??
          "Could not email Darboi via FormSubmit. Check darboiconsults@gmail.com for the activation link."
      );
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (data: ApplicationFormData, files: File[]) => {
    setSubmitting(true);
    try {
      const { application } = await submitApplicationViaApi(
        storageSlug,
        serviceName,
        data,
        files,
        undefined,
        { skipOwnerEmail: true }
      );
      sessionStorage.setItem("pending_application_id", application.id);
      const emailSent = await emailOwnerViaFormSubmit(application, "submitted");
      toastApplicationSaved({ emailSent });
      setSubmitted(application);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not save your application. Please try again or contact us on WhatsApp."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStageForPayment = useCallback((data: ApplicationFormData, files: File[]) => {
    pendingRef.current = {
      form: data,
      files,
      applicationId: crypto.randomUUID(),
    };
    setModalOpen(true);
  }, []);

  const finishAfterPayment = async (paymentReference: string) => {
    const pending = pendingRef.current;
    if (!pending) {
      toast.error("Form data missing. Please go back and try again.");
      return;
    }

    setFinishing(true);
    const amount = settings.feeAmount;
    try {
      const refNote = paymentReference.trim()
        ? `\nPayment Reference: ${paymentReference.trim()}`
        : "";
      const formWithPayment = {
        ...pending.form,
        notes: `${pending.form.notes || ""}${refNote}`.trim(),
      };

      const { application } = await submitApplicationViaApi(
        storageSlug,
        serviceName,
        formWithPayment,
        pending.files,
        pending.applicationId,
        { skipOwnerEmail: true }
      );
      sessionStorage.setItem("pending_application_id", application.id);

      const res = await fetch(`/api/applications/${application.id}/complete-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentReference: paymentReference || undefined,
          amount,
          paymentType: "booking-fee",
        }),
      });
      const json = (await res.json()) as {
        emailSent?: boolean;
        error?: string;
        application?: Application;
      };

      if (!res.ok) throw new Error(json.error || "Could not record payment");

      const app = json.application ?? application;
      const emailSent = await emailOwnerViaFormSubmit(app, "paid", amount);
      pendingRef.current = null;
      setModalOpen(false);
      toastPaymentComplete({ emailSent });
      redirectToWhatsApp(
        getApplicationWhatsAppMessage({
          stage: "paid",
          kind,
          applicationId: app.id,
          serviceName,
          applicantName: app.full_name,
          reference: paymentReference || app.payment_reference || undefined,
          paymentAmount: amount,
          paymentType: "booking-fee",
        })
      );
    } catch {
      toast.error("Could not save your application. Opening WhatsApp — please send your payment reference there.");
      setModalOpen(false);
      const fallbackId = pending.applicationId;
      redirectToWhatsApp(
        getApplicationWhatsAppMessage({
          stage: "paid",
          kind,
          applicationId: fallbackId,
          serviceName,
          applicantName: pending.form.fullName,
          reference: paymentReference || undefined,
          paymentAmount: amount,
          paymentType: "booking-fee",
        })
      );
    } finally {
      setFinishing(false);
    }
  };

  const handlePaymentDone = async (paymentReference: string) => {
    if (submitAfterPayment) {
      await finishAfterPayment(paymentReference);
      return;
    }

    if (!submitted) return;
    setFinishing(true);
    const amount = settings.feeAmount;
    try {
      const res = await fetch(`/api/applications/${submitted.id}/complete-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentReference: paymentReference || undefined,
          amount,
          paymentType: "booking-fee",
        }),
      });
      const json = (await res.json()) as {
        emailSent?: boolean;
        error?: string;
        application?: Application;
      };

      if (!res.ok) throw new Error(json.error || "Could not record payment");

      const app = json.application ?? submitted;
      const emailSent = await emailOwnerViaFormSubmit(app, "paid", amount);
      setModalOpen(false);
      toastPaymentComplete({ emailSent });
      redirectToWhatsApp(
        getApplicationWhatsAppMessage({
          stage: "paid",
          kind,
          applicationId: app.id,
          serviceName,
          applicantName: app.full_name,
          reference: paymentReference || app.payment_reference || undefined,
          paymentAmount: amount,
          paymentType: "booking-fee",
        })
      );
    } catch {
      toast.error("Could not save payment. Opening WhatsApp anyway.");
      setModalOpen(false);
      redirectToWhatsApp(
        getApplicationWhatsAppMessage({
          stage: "paid",
          kind,
          applicationId: submitted.id,
          serviceName,
          applicantName: submitted.full_name,
          reference: paymentReference || undefined,
          paymentAmount: amount,
          paymentType: "booking-fee",
        })
      );
    } finally {
      setFinishing(false);
    }
  };

  const childProps = {
    onSubmit: handleFormSubmit,
    onStageForPayment: handleStageForPayment,
    submitLabel: submitAfterPayment ? "Make payment" : "Submit Application",
    deferPaymentToModal: !submitAfterPayment,
    paymentStepOpensModal: submitAfterPayment,
    disabled: submitting || finishing,
  };

  if (!submitAfterPayment && submitted) {
    return (
      <>
        <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-8 text-center">
          <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">
            Application submitted
          </h2>
          <p className="mt-2 text-sm text-navy-600 dark:text-navy-300">
            Pay <strong>{settings.feeAmountLabel}</strong> by bank transfer, then tap below.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-3.5 text-sm font-bold text-navy-950 hover:bg-gold-400 sm:w-auto"
          >
            Make payment
          </button>
        </div>
        <PaymentDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onDone={handlePaymentDone}
          settings={settings}
          loadingDone={finishing}
        />
      </>
    );
  }

  return (
    <>
      {children(childProps)}
      <PaymentDetailsModal
        open={modalOpen}
        onClose={() => !finishing && setModalOpen(false)}
        onDone={handlePaymentDone}
        settings={settings}
        loadingDone={finishing}
        doneLabel="I've made payment — Open WhatsApp"
      />
    </>
  );
}
