"use client";

import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { ApplicationSubmitFlow } from "@/components/forms/ApplicationSubmitFlow";
import { DarboiApplicationForm } from "@/components/forms/DarboiApplicationForm";
import { WhatsAppCTA } from "@/components/layout/WhatsAppCTA";
import { getProgramBySlug } from "@/data/programs";
import { serviceUsesVisaForm } from "@/data/service-application-forms";
import { mapDarboiToApplicationData } from "@/lib/application-mapper";
import { getConsultationWhatsAppMessage } from "@/lib/whatsapp";
import { PaymentSettingsFeeLabel } from "@/components/payment/PaymentSettingsLabel";
import { usePaymentSettings } from "@/components/forms/usePaymentSettings";
import { serviceOffersConsultation } from "@/lib/service-consultation";
import type { ServiceItem } from "@/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function ConsultationPageContent({ services }: { services: ServiceItem[] }) {
  const { settings: payment } = usePaymentSettings();
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

  const selectedService = serviceSlug ? services.find((s) => s.slug === serviceSlug) : null;
  const consultationAllowed =
    Boolean(programSlug) || !serviceSlug || serviceOffersConsultation(selectedService);

  if (!consultationAllowed && selectedService) {
    return (
      <>
        <section className="bg-navy-950 pt-24 pb-8 sm:pt-28">
          <div className="container-custom px-4 text-center sm:px-6 sm:text-left">
            <p className="text-xs font-semibold tracking-wider text-gold-400 uppercase">Application</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">{selectedService.title}</h1>
            <p className="mt-2 text-navy-300">
              Consultation is for travel programs and travel services only. Use the application form for this
              service.
            </p>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-custom max-w-3xl text-center sm:text-left">
            <Link
              href={`/services/${selectedService.slug}/apply`}
              className="inline-flex items-center justify-center rounded-xl bg-gold-500 px-8 py-3.5 text-sm font-bold text-navy-950 hover:bg-gold-400"
            >
              Apply for {selectedService.title}
            </Link>
            <Link
              href={`/services/${selectedService.slug}`}
              className="mt-4 block text-sm font-medium text-gold-600 hover:underline"
            >
              ← Back to service details
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-navy-950 pt-24 pb-8 sm:pt-28">
        <div className="container-custom px-4 text-center sm:px-6 sm:text-left">
          <p className="text-xs font-semibold tracking-wider text-gold-400 uppercase">Consultation</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Application Form</h1>
          <p className="mt-2 text-navy-300">{label}</p>
          <p className="mt-2 text-sm text-gold-400/90">
            <PaymentSettingsFeeLabel prefix="Consultation fee" />
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <p className="mb-6 text-sm text-navy-600 dark:text-navy-300">
            Step 5 is <strong className="text-navy-800 dark:text-navy-100">Make payment</strong> — bank
            details open in a popup. After you pay, tap <strong>I&apos;ve made payment</strong> to submit and open
            WhatsApp. Fee: <strong>{payment.feeAmountLabel}</strong>.
          </p>
          <div className="min-w-0 overflow-hidden rounded-2xl border border-navy-100 bg-white p-4 shadow-xl sm:p-8 dark:border-navy-800 dark:bg-navy-900">
            <ApplicationSubmitFlow
              storageSlug={storageSlug}
              serviceName={label}
              kind={kind}
              submitAfterPayment
            >
              {({
                onSubmit,
                onStageForPayment,
                onStepProgress,
                submitLabel,
                deferPaymentToModal,
                paymentStepOpensModal,
                paymentFeeLabel,
                disabled,
              }) =>
                serviceSlug && serviceUsesVisaForm(serviceSlug) ? (
                  <ApplicationForm
                    serviceSlug={serviceSlug}
                    serviceTitle={label}
                    onSubmit={onSubmit}
                    onStageForPayment={onStageForPayment}
                    onStepProgress={onStepProgress}
                    submitLabel={submitLabel}
                    deferPaymentToModal={deferPaymentToModal}
                    paymentStepOpensModal={paymentStepOpensModal}
                    paymentFeeLabel={paymentFeeLabel}
                    disabled={disabled}
                  />
                ) : (
                  <DarboiApplicationForm
                    contextLabel={label}
                    submitLabel={submitLabel}
                    showPaymentInfo={false}
                    deferPaymentToModal={deferPaymentToModal}
                    paymentStepOpensModal={paymentStepOpensModal}
                    paymentFeeLabel={paymentFeeLabel}
                    disabled={disabled}
                    onStageForPayment={(data, files) => {
                      const allFiles = [...files.passportPhoto, ...files.passportBioPage];
                      onStageForPayment(mapDarboiToApplicationData(data), allFiles);
                    }}
                    onStepComplete={(data) => onStepProgress(mapDarboiToApplicationData(data))}
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
