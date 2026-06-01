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
import type { PaymentSettings } from "@/data/payment-settings-default";
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
  paymentSettings?: PaymentSettings;
  submitAfterPayment?: boolean;
  children: (props: {
    onSubmit: (data: ApplicationFormData, files: File[]) => Promise<void>;
    onStageForPayment: (data: ApplicationFormData, files: File[]) => void;
    onStepProgress: (data: ApplicationFormData) => void;
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
  const [preparingSave, setPreparingSave] = useState(false);

  const pendingRef = useRef<PendingSubmission | null>(null);
  const savedApplicationRef = useRef<Application | null>(null);
  const savePromiseRef = useRef<Promise<Application> | null>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const applicationIdRef = useRef<string>("");

  const { settings: liveSettings } = usePaymentSettings();
  const settings = paymentSettingsOverride ?? liveSettings;

  useEffect(() => {
    applicationIdRef.current = getOrCreateApplicationId(storageSlug);
  }, [storageSlug]);

  const persistFullApplication = useCallback(
    async (form: ApplicationFormData, files: File[], applicationId: string) => {
      const promise = submitApplicationViaApi(
        storageSlug,
        serviceName,
        form,
        files,
        applicationId,
        { skipOwnerEmail: true }
      ).then(({ application }) => {
        rememberApplicationId(storageSlug, application.id);
        savedApplicationRef.current = application;
        return application;
      });

      savePromiseRef.current = promise;
      return promise;
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
          /* silent — full save runs before payment */
        });
      }, 600);
    },
    [storageSlug, serviceName]
  );

  const startBackgroundFullSave = useCallback(
    (form: ApplicationFormData, files: File[], applicationId: string) => {
      setPreparingSave(true);
      void persistFullApplication(form, files, applicationId)
        .then(() => setPreparingSave(false))
        .catch(() => {
          setPreparingSave(false);
          toast.error("Could not save your application yet. You can still pay — we will retry when you confirm.");
        });
    },
    [persistFullApplication]
  );

  const resolveSavedApplication = useCallback(
    async (pending: PendingSubmission, paymentReference: string): Promise<Application> => {
      if (savedApplicationRef.current) return savedApplicationRef.current;

      if (savePromiseRef.current) {
        try {
          return await savePromiseRef.current;
        } catch {
          /* fall through to sync save */
        }
      }

      const refNote = paymentReference.trim()
        ? `\nPayment Reference: ${paymentReference.trim()}`
        : "";
      const formWithPayment = {
        ...pending.form,
        notes: `${pending.form.notes || ""}${refNote}`.trim(),
      };

      return persistFullApplication(formWithPayment, pending.files, pending.applicationId);
    },
    [persistFullApplication]
  );

  const finalizePayment = useCallback(
    async (application: Application, paymentReference: string) => {
      const amount = settings.feeAmount;
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
        error?: string;
        application?: Application;
      };

      if (!res.ok) throw new Error(json.error || "Could not record payment");

      const app = json.application ?? application;

      const waMessage = getApplicationWhatsAppMessage({
        stage: "paid",
        kind,
        applicationId: app.id,
        serviceName,
        applicantName: app.full_name,
        reference: paymentReference || app.payment_reference || undefined,
        paymentAmount: amount,
        paymentType: "booking-fee",
      });

      void notifyApplicationOwner(app, { stage: "paid", paymentAmount: amount }).then((notify) => {
        if (!notify.ok) {
          toast.error(notify.message ?? "Payment recorded but email could not be sent.");
        }
      });

      setModalOpen(false);
      setFinishing(false);
      toastPaymentComplete({ emailSent: true });
      redirectToWhatsApp(waMessage);
    },
    [kind, serviceName, settings.feeAmount]
  );

  const handleFormSubmit = async (data: ApplicationFormData, files: File[]) => {
    setSubmitting(true);
    const applicationId = applicationIdRef.current || getOrCreateApplicationId(storageSlug);
    applicationIdRef.current = applicationId;

    try {
      const { application } = await submitApplicationViaApi(
        storageSlug,
        serviceName,
        data,
        files,
        applicationId,
        { skipOwnerEmail: true }
      );
      rememberApplicationId(storageSlug, application.id);
      savedApplicationRef.current = application;
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
    (data: ApplicationFormData, files: File[]) => {
      const applicationId = applicationIdRef.current || getOrCreateApplicationId(storageSlug);
      applicationIdRef.current = applicationId;

      pendingRef.current = { form: data, files, applicationId };
      setModalOpen(true);
      startBackgroundFullSave(data, files, applicationId);
    },
    [storageSlug, startBackgroundFullSave]
  );

  const finishAfterPayment = async (paymentReference: string) => {
    const pending = pendingRef.current;
    if (!pending) {
      toast.error("Form data missing. Please go back and try again.");
      return;
    }

    setFinishing(true);
    try {
      const application = await resolveSavedApplication(pending, paymentReference);
      pendingRef.current = null;
      await finalizePayment(application, paymentReference);
    } catch {
      toast.error("Could not confirm payment. Opening WhatsApp — please send your payment reference there.");
      setModalOpen(false);
      redirectToWhatsApp(
        getApplicationWhatsAppMessage({
          stage: "paid",
          kind,
          applicationId: pending.applicationId,
          serviceName,
          applicantName: pending.form.fullName,
          reference: paymentReference || undefined,
          paymentAmount: settings.feeAmount,
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

    try {
      await finalizePayment(submitted, paymentReference);
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
          paymentAmount: settings.feeAmount,
          paymentType: "booking-fee",
        })
      );
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
    disabled: submitting || finishing,
  };

  const modalLoadingLabel = finishing
    ? "Confirming payment…"
    : preparingSave
      ? "Uploading documents…"
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
          settings={settings}
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
        onClose={() => !finishing && setModalOpen(false)}
        onDone={handlePaymentDone}
        settings={settings}
        loadingDone={finishing}
        loadingLabel="Confirming payment…"
        statusHint={
          preparingSave ? "Your application is uploading in the background. You can pay now." : undefined
        }
        doneLabel="I've made payment — Open WhatsApp"
      />
    </>
  );
}
