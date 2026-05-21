"use client";

import { DynamicConsultationForm } from "@/components/forms/DynamicConsultationForm";
import { PageHero } from "@/components/layout/PageHero";
import { getConsultationSchema } from "@/data/consultation-forms";
import { getProgramBySlug } from "@/data/programs";
import { services } from "@/data/services";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

function ConsultationContent() {
  const searchParams = useSearchParams();
  const programSlug = searchParams.get("program");
  const serviceSlug = searchParams.get("service");

  const { schema, label, paymentHref } = useMemo(() => {
    if (programSlug) {
      const program = getProgramBySlug(programSlug);
      return {
        schema: getConsultationSchema("program", program?.title ?? programSlug),
        label: program?.title ?? programSlug,
        paymentHref: undefined,
      };
    }
    if (serviceSlug) {
      const service = services.find((s) => s.slug === serviceSlug);
      return {
        schema: getConsultationSchema("service", service?.title ?? serviceSlug),
        label: service?.title ?? serviceSlug,
        paymentHref: `/services/${serviceSlug}/apply`,
      };
    }
    return {
      schema: getConsultationSchema("general"),
      label: "General Consultation",
      paymentHref: undefined,
    };
  }, [programSlug, serviceSlug]);

  return (
    <>
      <PageHero
        title="Start Your Consultation"
        subtitle={label}
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80"
      />
      <section className="section-padding">
        <div className="container-custom max-w-2xl">
          <div className="mb-8 rounded-2xl border border-gold-500/20 bg-gold-500/5 p-4 text-sm text-navy-700 dark:text-navy-200">
            <strong>Flow:</strong> Service Selection → Consultation Form → Payment (if applicable) → Case Review → WhatsApp
          </div>
          <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-xl dark:border-navy-800 dark:bg-navy-900">
            <DynamicConsultationForm
              schema={schema}
              contextLabel={label}
              redirectToPayment={paymentHref}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense fallback={<div className="container-custom py-32 text-center">Loading consultation...</div>}>
      <ConsultationContent />
    </Suspense>
  );
}
