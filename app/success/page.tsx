"use client";

import { Button } from "@/components/ui/Button";
import { APPLICATION_WHATSAPP_MESSAGE, getWhatsAppUrl } from "@/lib/constants";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const ref = searchParams.get("ref");
  const [countdown, setCountdown] = useState(5);

  const whatsappMessage = ref
    ? `${APPLICATION_WHATSAPP_MESSAGE} Reference: ${ref}`
    : applicationId
      ? `${APPLICATION_WHATSAPP_MESSAGE} Application ID: ${applicationId}`
      : APPLICATION_WHATSAPP_MESSAGE;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          window.location.href = getWhatsAppUrl(whatsappMessage);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [whatsappMessage]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center section-padding">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg rounded-3xl border border-navy-100 bg-white p-12 text-center shadow-2xl dark:border-navy-800 dark:bg-navy-900"
      >
        <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
        <h1 className="mt-6 font-display text-3xl font-bold text-navy-900 dark:text-white">
          Application Submitted Successfully
        </h1>
        <p className="mt-4 text-navy-600 dark:text-navy-300">
          Thank you! Your application has been received and our team has been notified by email.
        </p>
        {applicationId && (
          <p className="mt-2 text-sm text-navy-500">Reference: {applicationId.slice(0, 8)}...</p>
        )}
        <p className="mt-6 text-sm text-gold-600">
          Redirecting to WhatsApp in {countdown} seconds...
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href={getWhatsAppUrl(whatsappMessage)} size="lg">
            Open WhatsApp Now
          </Button>
          <Button href="/services" variant="outline">
            Back to Services
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
