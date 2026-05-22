"use client";

import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { ApplicationSubmitFlow } from "@/components/forms/ApplicationSubmitFlow";
import { PageHero } from "@/components/layout/PageHero";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ServiceItem } from "@/types";

export default function ApplyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [service, setService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    fetch(`/api/services/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setService)
      .catch(() => setService(null));
  }, [slug]);

  if (!service) {
    return (
      <div className="container-custom py-32 text-center">
        <p>Service not found.</p>
      </div>
    );
  }

  return (
    <>
      <PageHero title="Application Form" subtitle={`Apply for ${service.title}`} />
      <section className="section-padding bg-navy-50/50 dark:bg-navy-950/30">
        <div className="container-custom max-w-2xl">
          <ApplicationSubmitFlow storageSlug={slug} serviceName={service.title} kind="service">
            {({ onSubmit, onStageForPayment, submitLabel, deferPaymentToModal, paymentStepOpensModal, disabled }) => (
              <ApplicationForm
                serviceSlug={slug}
                serviceTitle={service.title}
                onSubmit={onSubmit}
                onStageForPayment={onStageForPayment}
                submitLabel={submitLabel}
                deferPaymentToModal={deferPaymentToModal}
                paymentStepOpensModal={paymentStepOpensModal}
                disabled={disabled}
              />
            )}
          </ApplicationSubmitFlow>
        </div>
      </section>
    </>
  );
}
