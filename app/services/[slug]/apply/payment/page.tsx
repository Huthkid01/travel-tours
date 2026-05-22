"use client";

import { FormProgressBar } from "@/components/forms/FormProgressBar";
import { BankTransferCheckout } from "@/components/payment/BankTransferCheckout";
import { PageHero } from "@/components/layout/PageHero";
import { Skeleton } from "@/components/ui/Skeleton";
import { getServiceBySlug } from "@/data/services";
import { APPOINTMENT_FEE_INFO } from "@/data/darboi-application-form";
import {
  getApplicationAction,
  notifyPaymentAction,
  updateApplicationPaymentAction,
} from "@/lib/actions/application";
import { toastPaymentComplete } from "@/lib/application-toast";
import { sendApplicationViaFormSubmitClient } from "@/lib/formsubmit-client";
import { getApplicationWhatsAppMessage, redirectToWhatsApp } from "@/lib/whatsapp";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const applicationId = searchParams.get("applicationId");

  const service = getServiceBySlug(slug);
  const [application, setApplication] = useState<Awaited<ReturnType<typeof getApplicationAction>>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!applicationId) {
      setLoading(false);
      return;
    }
    getApplicationAction(applicationId).then((app) => {
      setApplication(app);
      setLoading(false);
    });
  }, [applicationId]);

  const handlePaymentComplete = async (reference: string, amount: number) => {
    if (!application || !service) return;

    try {
      const updated = await updateApplicationPaymentAction(application.id, {
        reference,
        status: "paid",
        type: "booking-fee",
        amount,
        provider: "bank-transfer",
      });

      if (updated) {
        const waMessage = getApplicationWhatsAppMessage({
          stage: "paid",
          kind: "service",
          applicationId: updated.id,
          reference,
          serviceName: service.title,
          paymentAmount: amount,
          paymentType: "booking-fee",
          applicantName: updated.full_name,
        });
        toastPaymentComplete({ emailSent: true });
        void sendApplicationViaFormSubmitClient(updated, {
          stage: "paid",
          paymentAmount: amount,
        });
        void notifyPaymentAction(updated, amount);
        redirectToWhatsApp(waMessage);
      }
    } catch {
      toast.error("Payment recorded. Opening WhatsApp with your reference.");
      redirectToWhatsApp(
        getApplicationWhatsAppMessage({
          stage: "paid",
          kind: "service",
          applicationId: application.id,
          reference,
          serviceName: service.title,
          paymentAmount: amount,
          paymentType: "booking-fee",
          applicantName: application.full_name,
        })
      );
    }
  };

  if (!service) {
    return <div className="container-custom py-32 text-center">Service not found.</div>;
  }

  if (loading) {
    return (
      <div className="container-custom max-w-2xl space-y-4 py-32">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-3/4" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container-custom py-32 text-center">
        <p>Application not found. Please submit the form first.</p>
      </div>
    );
  }

  return (
    <>
      <PageHero title="Bank transfer" subtitle={`Complete payment for ${service.title}`} />
      <section className="section-padding bg-navy-50/50 dark:bg-navy-950/30">
        <div className="container-custom max-w-2xl space-y-6">
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold tracking-[0.2em] text-gold-600 uppercase">Payment</p>
            <p className="mt-1 text-sm text-navy-600 dark:text-navy-400">
              Application received — pay by bank transfer to finish
            </p>
          </div>

          <FormProgressBar
            steps={["Personal", "Contact", "Details", "Documents", "Payment"]}
            currentStep={4}
          />

          <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm dark:border-navy-800 dark:bg-navy-900">
            <div className="border-b border-navy-100 bg-navy-50/80 px-4 py-4 sm:px-6 dark:border-navy-800 dark:bg-navy-950/50">
              <h2 className="font-display text-lg font-bold text-navy-900 dark:text-white">
                Bank transfer
              </h2>
              <p className="mt-0.5 text-sm text-navy-600 dark:text-navy-400">
                Copy account details, transfer, then confirm below
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <BankTransferCheckout
                application={application}
                serviceTitle={service.title}
                amount={APPOINTMENT_FEE_INFO.amount}
                amountLabel={APPOINTMENT_FEE_INFO.amountLabel}
                onPaymentComplete={handlePaymentComplete}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
