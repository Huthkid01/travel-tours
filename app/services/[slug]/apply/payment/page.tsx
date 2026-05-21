"use client";

import { ApplicationPayment } from "@/components/payment/ApplicationPayment";
import { PageHero } from "@/components/layout/PageHero";
import { Skeleton } from "@/components/ui/Skeleton";
import { getServiceBySlug } from "@/data/services";
import { getApplication, updateApplicationPayment } from "@/services/applications";
import { getApplicationWhatsAppMessage, redirectToWhatsApp } from "@/lib/whatsapp";
import { notifyOwnerOnPayment } from "@/lib/notify-owner";
import type { Application, PaymentProvider, PaymentType } from "@/types";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const applicationId = searchParams.get("applicationId");

  const service = getServiceBySlug(slug);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!applicationId) {
      setLoading(false);
      return;
    }
    getApplication(applicationId).then((app) => {
      setApplication(app);
      setLoading(false);
    });
  }, [applicationId]);

  const handlePaymentComplete = async (
    reference: string,
    type: PaymentType,
    amount: number,
    provider: PaymentProvider
  ) => {
    if (!application || !service) return;

    try {
      const updated = await updateApplicationPayment(application.id, {
        reference,
        status: "paid",
        type,
        amount,
        provider,
      });

      if (updated) {
        await notifyOwnerOnPayment(updated, amount);
        toast.success("Payment complete! Opening WhatsApp…");
        const message = getApplicationWhatsAppMessage({
          applicationId: updated.id,
          reference,
          serviceName: service.title,
          paymentAmount: amount,
          applicantName: updated.full_name,
        });
        redirectToWhatsApp(message);
      }
    } catch {
      toast.error("Payment recorded. Opening WhatsApp with your reference.");
      redirectToWhatsApp(
        getApplicationWhatsAppMessage({
          applicationId: application.id,
          reference,
          serviceName: service.title,
          paymentAmount: amount,
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
      <PageHero title="Secure Payment" subtitle={`Complete payment for ${service.title}`} />
      <section className="section-padding">
        <div className="container-custom max-w-2xl">
          <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-xl dark:border-navy-800 dark:bg-navy-900">
            <ApplicationPayment
              application={application}
              service={service}
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        </div>
      </section>
    </>
  );
}
