"use client";

import { Button } from "@/components/ui/Button";
import { getApplicationWhatsAppMessage, redirectToWhatsApp } from "@/lib/whatsapp";
import { getApplicationAction } from "@/lib/actions/application";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const ref = searchParams.get("ref");
  const [applicantName, setApplicantName] = useState<string | undefined>();
  const [serviceName, setServiceName] = useState<string | undefined>();
  const [paymentAmount, setPaymentAmount] = useState<number | undefined>();
  const [paymentType, setPaymentType] = useState<string | undefined>();

  useEffect(() => {
    if (!applicationId) return;
    getApplicationAction(applicationId).then((app) => {
      if (app) {
        setApplicantName(app.full_name);
        setServiceName(app.service_name);
        if (app.payment_amount != null) setPaymentAmount(app.payment_amount);
        if (app.payment_type) setPaymentType(app.payment_type);
      }
    });
  }, [applicationId]);

  const whatsappMessage = useMemo(
    () =>
      getApplicationWhatsAppMessage({
        stage: "paid",
        applicationId,
        reference: ref,
        serviceName,
        applicantName,
        paymentAmount,
        paymentType,
      }),
    [applicationId, ref, serviceName, applicantName, paymentAmount, paymentType]
  );

  const handleDone = () => {
    redirectToWhatsApp(whatsappMessage);
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center section-padding">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg rounded-3xl border border-navy-100 bg-white p-12 text-center shadow-2xl dark:border-navy-800 dark:bg-navy-900"
      >
        <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
        <h1 className="mt-6 font-display text-3xl font-bold text-navy-900 dark:text-white">
          Payment Successful
        </h1>
        <p className="mt-4 text-navy-600 dark:text-navy-300">
          Thank you! Your payment was recorded and Darboi Consults has been notified by email.
        </p>
        {applicationId && (
          <p className="mt-2 text-sm text-navy-500">Reference: {applicationId.slice(0, 8)}…</p>
        )}
        <p className="mt-6 text-sm text-navy-600 dark:text-navy-400">
          Tap <strong>Done</strong> below to open WhatsApp with your application details.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" onClick={handleDone} size="lg">
            Done — Open WhatsApp
          </Button>
          <Button href="/services" variant="outline">
            Back to Services
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
