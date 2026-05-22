"use client";

import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { ApplicationSubmitFlow } from "@/components/forms/ApplicationSubmitFlow";
import { DarboiApplicationForm } from "@/components/forms/DarboiApplicationForm";
import { WhatsAppCTA } from "@/components/layout/WhatsAppCTA";
import { getProgramBySlug } from "@/data/programs";
import { serviceUsesVisaForm } from "@/data/service-application-forms";
import { mapDarboiToApplicationData } from "@/lib/application-mapper";
import { getConsultationWhatsAppMessage } from "@/lib/whatsapp";
import { CONSULTATION_PAYMENT_SETTINGS } from "@/lib/consultation-payment";
import type { ServiceItem } from "@/types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function ConsultationPageContent({ services }: { services: ServiceItem[] }) {
  const searchParams = useSearchParams();
  const programSlug = searchParams.get("program");
  const serviceSlug = searchParams.get("service");

  const { label, storageSlug, kind } = useMemo(() => {
    if (programSlug) {
      const program = getProgramBySlug(programSlug);
      return {
        label: program?.title ?? programSlug,
        storageSlug: programSlug,
        kind: "consultation" as const,
      };
    }
    if (serviceSlug) {
      const service = services.find((s) => s.slug === serviceSlug);
      return {
        label: service?.title ?? serviceSlug,
        storageSlug: serviceSlug,
        kind: "consultation" as const,
      };
    }
    return { label: "General Consultation", storageSlug: "consultation", kind: "consultation" as const };
  }, [programSlug, serviceSlug, services]);

  return (
    <>
      <section className="bg-navy-950 pt-24 pb-8 sm:pt-28">
        <div className="container-custom px-4 text-center sm:px-6 sm:text-left">
          <p className="text-xs font-semibold tracking-wider text-gold-400 uppercase">Consultation</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Application Form</h1>
          <p className="mt-2 text-navy-300">{label}</p>
          <p className="mt-2 text-sm text-gold-400/90">
            Consultation fee: {CONSULTATION_PAYMENT_SETTINGS.feeAmountLabel}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <p className="mb-6 text-sm text-navy-600 dark:text-navy-300">
            {programSlug || (serviceSlug && !serviceUsesVisaForm(serviceSlug))
              ? "Complete the form, then pay by bank transfer to confirm your consultation."
              : `Complete the application form. Consultation fee is ${CONSULTATION_PAYMENT_SETTINGS.feeAmountLabel}.`}
          </p>
          <div className="min-w-0 overflow-hidden rounded-2xl border border-navy-100 bg-white p-4 shadow-xl sm:p-8 dark:border-navy-800 dark:bg-navy-900">
            <ApplicationSubmitFlow
              storageSlug={storageSlug}
              serviceName={label}
              kind={kind}
              paymentSettings={CONSULTATION_PAYMENT_SETTINGS}
            >
              {({ onSubmit, submitLabel, deferPaymentToModal, disabled }) =>
                serviceSlug && serviceUsesVisaForm(serviceSlug) ? (
                  <ApplicationForm
                    serviceSlug={serviceSlug}
                    serviceTitle={label}
                    onSubmit={onSubmit}
                    submitLabel={submitLabel}
                    deferPaymentToModal={deferPaymentToModal}
                    disabled={disabled}
                  />
                ) : (
                  <DarboiApplicationForm
                    contextLabel={label}
                    submitLabel={submitLabel}
                    showPaymentInfo={false}
                    deferPaymentToModal={deferPaymentToModal}
                    disabled={disabled}
                    onSubmit={async (data, files) => {
                      const form = mapDarboiToApplicationData(data);
                      const allFiles = [...files.passportPhoto, ...files.passportBioPage];
                      await onSubmit(form, allFiles);
                    }}
                  />
                )
              }
            </ApplicationSubmitFlow>
            <div className="mt-6 border-t border-navy-100 pt-6 dark:border-navy-800">
              <WhatsAppCTA
                message={getConsultationWhatsAppMessage(label)}
                variant="link"
                label="Prefer WhatsApp only?"
                service={label}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
