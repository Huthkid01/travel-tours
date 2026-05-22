"use client";

import { PaymentDetailsModal } from "@/components/payment/PaymentDetailsModal";
import { toastApplicationSaved } from "@/lib/application-toast";
import { submitApplicationViaApi } from "@/lib/submit-application-client";
import { getApplicationWhatsAppMessage, redirectToWhatsApp } from "@/lib/whatsapp";
import type { Application, ApplicationFormData } from "@/types";
import { APPOINTMENT_FEE_INFO } from "@/data/darboi-application-form";
import { CheckCircle, CreditCard } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

interface ApplicationSubmitFlowProps {
  storageSlug: string;
  serviceName: string;
  children: (props: {
    onSubmit: (data: ApplicationFormData, files: File[]) => Promise<void>;
    submitLabel: string;
    deferPaymentToModal: boolean;
    disabled: boolean;
  }) => ReactNode;
}

export function ApplicationSubmitFlow({
  storageSlug,
  serviceName,
  children,
}: ApplicationSubmitFlowProps) {
  const [submitted, setSubmitted] = useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (data: ApplicationFormData, files: File[]) => {
    setSubmitting(true);
    try {
      const { application, emailSent } = await submitApplicationViaApi(
        storageSlug,
        serviceName,
        data,
        files
      );
      sessionStorage.setItem("pending_application_id", application.id);
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

  const handlePaymentDone = async (paymentReference: string) => {
    if (!submitted) return;
    setFinishing(true);
    try {
      if (paymentReference) {
        await fetch(`/api/applications/${submitted.id}/payment-reference`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentReference }),
        });
      }
      setModalOpen(false);
      redirectToWhatsApp(
        getApplicationWhatsAppMessage({
          stage: "paid",
          applicationId: submitted.id,
          serviceName,
          applicantName: submitted.full_name,
          reference: paymentReference || undefined,
          paymentAmount: APPOINTMENT_FEE_INFO.amount,
          paymentType: "booking-fee",
        })
      );
    } catch {
      toast.error("Could not save payment reference. Opening WhatsApp anyway.");
      redirectToWhatsApp(
        getApplicationWhatsAppMessage({
          stage: "paid",
          applicationId: submitted.id,
          serviceName,
          applicantName: submitted.full_name,
          reference: paymentReference || undefined,
        })
      );
    } finally {
      setFinishing(false);
    }
  };

  if (submitted) {
    return (
      <>
        <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-8 text-center">
          <CheckCircle className="mx-auto h-14 w-14 text-green-500" />
          <h2 className="mt-4 font-display text-xl font-bold text-navy-900 dark:text-white">
            Application submitted
          </h2>
          <p className="mt-2 text-sm text-navy-600 dark:text-navy-300">
            Your details are saved. Make your bank transfer, then continue to WhatsApp so we can confirm payment and
            next steps.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-3.5 text-sm font-bold text-navy-950 hover:bg-gold-400 sm:w-auto"
          >
            <CreditCard className="h-5 w-5" />
            Continue to Payment
          </button>
        </div>
        <PaymentDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onDone={handlePaymentDone}
          loadingDone={finishing}
        />
      </>
    );
  }

  return (
    <>
      {children({
        onSubmit: handleFormSubmit,
        submitLabel: "Submit Application",
        deferPaymentToModal: true,
        disabled: submitting,
      })}
    </>
  );
}
