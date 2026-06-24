"use client";

import { usePaymentSettings } from "@/components/forms/usePaymentSettings";
import { PaymentDetailsModal } from "@/components/payment/PaymentDetailsModal";
import { toastApplicationSaved, toastPaymentComplete } from "@/lib/application-toast";
import {
  getOrCreateApplicationId,
  rememberApplicationId,
  saveApplicationDraftViaApi,
} from "@/lib/application-draft-client";
import { notifyApplicationOwner } from "@/lib/notify-owner-client";
import { submitApplicationViaApi } from "@/lib/submit-application-client";
import { getApplicationWhatsAppMessage, redirectToWhatsApp } from "@/lib/whatsapp";
import type { Application, ApplicationFormData } from "@/types";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
  submitAfterPayment?: boolean;
  children: (props: {
    onSubmit: (data: ApplicationFormData, files: File[]) => Promise<void>;
    onStageForPayment: (data: ApplicationFormData, files: File[]) => Promise<void>;
    onStepProgress: (data: ApplicationFormData) => void;
    submitLabel: string;
    deferPaymentToModal: boolean;
    paymentStepOpensModal: boolean;
    paymentFeeLabel: string;
    disabled: boolean;
  }) => ReactNode;
}

export function ApplicationSubmitFlow({
  storageSlug,
  serviceName,
  kind = "service",
  submitAfterPayment = false,
  children,
}: ApplicationSubmitFlowProps) {
  const [submitted, setSubmitted] = useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preparingSave, setPreparingSave] = useState(false);

  const pendingRef = useRef<PendingSubmission | null>(null);
  const savedApplicationRef = useRef<Application | null>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const applicationIdRef = useRef<string>("");

  const { settings } = usePaymentSettings();

  useEffect(() => {
    applicationIdRef.current = getOrCreateApplicationId(storageSlug);
  }, [storageSlug]);

  const persistFullApplication = useCallback(
    async (form: ApplicationFormData, files: File[], applicationId: string) => {
      const { application } = await submitApplicationViaApi(
        storageSlug,
        serviceName,
        form,
        files,
        applicationId,
        { skipOwnerEmail: true }
      );
      rememberApplicationId(storageSlug, application.id);
      savedApplicationRef.current = application;
      return application;
    },
    [storageSlug, serviceName]
  );

  const queueDraftSave = useCallback(
    (form: ApplicationFormData) => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
      draftTimerRef.current = setTimeout(() => {
        const id = applicationIdRef.current || getOrCreateApplicationId(storageSlug);
        applicationIdRef.current = id;
        void saveApplicationDraftViaApi(storageSlug, serviceName, form, id).catch(() => {
          /* silent — retried on next field change */
        });
      }, 500);
    },
    [storageSlug, serviceName]
  );

  const recordPaymentInBackground = useCallback(
    async (application: Application, paymentReference: string) => {
      const amount = settings.feeAmount;
      try {
        const res = await fetch(`/api/applications/${application.id}/complete-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentReference: paymentReference || undefined,
            amount,
            paymentType: "booking-fee",
          }),
        });
        if (!res.ok) return;

        void notifyApplicationOwner(application, { stage: "paid", paymentAmount: amount }).then((notify) => {
          if (!notify.ok) {
            toast.error(notify.message ?? "Payment recorded but confirmation email could not be sent.");
          }
        });
      } catch {
        /* payment record is best-effort — WhatsApp is the primary confirm step */
      }
    },
    [settings.feeAmount]
  );

  const handleFormSubmit = async (data: ApplicationFormData, files: File[]) => {
    setSubmitting(true);
    const applicationId = applicationIdRef.current || getOrCreateApplicationId(storageSlug);
    applicationIdRef.current = applicationId;

    try {
      const application = await persistFullApplication(data, files, applicationId);
      toastApplicationSaved({ nextStep: "payment" });
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

  const handleStageForPayment = useCallback(
    async (data: ApplicationFormData, files: File[]) => {
      const applicationId = applicationIdRef.current || getOrCreateApplicationId(storageSlug);
      applicationIdRef.current = applicationId;
      pendingRef.current = { form: data, files, applicationId };

      setPreparingSave(true);
      try {
        const application = await persistFullApplication(data, files, applicationId);

        const notify = await notifyApplicationOwner(application, { stage: "submitted" });
        if (!notify.ok) {
          toast.error(
            notify.message ??
              "Application saved but email could not be sent. Check Gmail settings in Vercel."
          );
        } else {
          toast.success("Application sent to Darboi Consults. Complete payment below.");
        }

        setModalOpen(true);
      } catch (err) {
        pendingRef.current = null;
        toast.error(
          err instanceof Error
            ? err.message
            : "Could not save your application. Please try again."
        );
      } finally {
        setPreparingSave(false);
      }
    },
    [storageSlug, persistFullApplication]
  );

  const finishAfterPayment = async (paymentReference: string) => {
    const pending = pendingRef.current;
    if (!pending) {
      toast.error("Form data missing. Please go back and try again.");
      return;
    }

    setFinishing(true);

    const waMessage = getApplicationWhatsAppMessage({
      stage: "paid",
      kind,
      applicationId: pending.applicationId,
      serviceName,
      applicantName: pending.form.fullName,
      reference: paymentReference || undefined,
      paymentAmount: settings.feeAmount,
      paymentType: "booking-fee",
    });

    let application = savedApplicationRef.current;

    try {
      if (!application) {
        try {
          const refNote = paymentReference.trim()
            ? `\nPayment Reference: ${paymentReference.trim()}`
            : "";
          const formWithPayment = {
            ...pending.form,
            notes: `${pending.form.notes || ""}${refNote}`.trim(),
          };
          application = await persistFullApplication(
            formWithPayment,
            pending.files,
            pending.applicationId
          );
        } catch {
          /* still open WhatsApp */
        }
      }

      if (application) {
        void recordPaymentInBackground(application, paymentReference);
      }

      setModalOpen(false);
      pendingRef.current = null;
      toastPaymentComplete({ emailSent: Boolean(application) });
      redirectToWhatsApp(waMessage);
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

    const waMessage = getApplicationWhatsAppMessage({
      stage: "paid",
      kind,
      applicationId: submitted.id,
      serviceName,
      applicantName: submitted.full_name,
      reference: paymentReference || undefined,
      paymentAmount: settings.feeAmount,
      paymentType: "booking-fee",
    });

    try {
      void recordPaymentInBackground(submitted, paymentReference);
      setModalOpen(false);
      toastPaymentComplete({ emailSent: true });
      redirectToWhatsApp(waMessage);
    } finally {
      setFinishing(false);
    }
  };

  const handleStepProgress = useCallback(
    (data: ApplicationFormData) => {
      queueDraftSave(data);
    },
    [queueDraftSave]
  );

  const childProps = {
    onSubmit: handleFormSubmit,
    onStageForPayment: handleStageForPayment,
    onStepProgress: handleStepProgress,
    submitLabel: submitAfterPayment ? "Make payment" : "Submit Application",
    deferPaymentToModal: !submitAfterPayment,
    paymentStepOpensModal: submitAfterPayment,
    paymentFeeLabel: settings.feeAmountLabel,
    disabled: submitting || finishing || preparingSave,
  };

  const modalLoadingLabel = finishing
    ? "Opening WhatsApp…"
    : preparingSave
      ? "Saving application & sending email…"
      : "Please wait…";

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
          loadingDone={finishing}
          loadingLabel={modalLoadingLabel}
        />
      </>
    );
  }

  return (
    <>
      {children(childProps)}
      <PaymentDetailsModal
        open={modalOpen}
        onClose={() => !finishing && !preparingSave && setModalOpen(false)}
        onDone={handlePaymentDone}
        loadingDone={finishing}
        loadingLabel={modalLoadingLabel}
        statusHint={
          preparingSave
            ? "Saving your application and emailing Darboi Consults…"
            : undefined
        }
        doneLabel="I've made payment — Open WhatsApp"
      />
    </>
  );
}
