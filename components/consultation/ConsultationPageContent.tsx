"use client";

import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { ApplicationSubmitFlow } from "@/components/forms/ApplicationSubmitFlow";
import { DarboiApplicationForm } from "@/components/forms/DarboiApplicationForm";
import { WhatsAppCTA } from "@/components/layout/WhatsAppCTA";
import { serviceUsesVisaForm } from "@/data/service-application-forms";
import {
  getApplicationWhatsAppMessage,
  getConsultationWhatsAppMessage,
  redirectToWhatsApp,
} from "@/lib/whatsapp";
import { mapDarboiToApplicationData } from "@/lib/application-mapper";
import { submitApplicationViaApi } from "@/lib/submit-application-client";
import { getProgramBySlug } from "@/data/programs";
import { PASSPORT_MATCH_NOTE } from "@/data/darboi-application-form";
import type { ServiceItem } from "@/types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toastApplicationSaved } from "@/lib/application-toast";
import { toast } from "sonner";

async function submitAndOpenWhatsApp(
  storageSlug: string,
  label: string,
  data: ReturnType<typeof mapDarboiToApplicationData>,
  files: File[],
  paymentRef?: string
) {
  const { application, emailSent } = await submitApplicationViaApi(storageSlug, label, data, files);
  toastApplicationSaved({ emailSent, nextStep: "whatsapp" });
  redirectToWhatsApp(
    getApplicationWhatsAppMessage({
      stage: paymentRef ? "paid" : "submitted",
      applicationId: application.id,
      serviceName: label,
      applicantName: application.full_name,
      reference: paymentRef,
    })
  );
}

export function ConsultationPageContent({ services }: { services: ServiceItem[] }) {
  const searchParams = useSearchParams();
  const programSlug = searchParams.get("program");
  const serviceSlug = searchParams.get("service");

  const { label } = useMemo(() => {
    if (programSlug) {
      const program = getProgramBySlug(programSlug);
      return { label: program?.title ?? programSlug };
    }
    if (serviceSlug) {
      const service = services.find((s) => s.slug === serviceSlug);
      return { label: service?.title ?? serviceSlug };
    }
    return { label: "General Consultation" };
  }, [programSlug, serviceSlug, services]);

  return (
    <>
      <section className="bg-navy-950 pt-24 pb-8 sm:pt-28">
        <div className="container-custom px-4 text-center sm:px-6 sm:text-left">
          <p className="text-xs font-semibold tracking-wider text-gold-400 uppercase">Consultation</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Application Form</h1>
          <p className="mt-2 text-navy-300">{label}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <p className="mb-6 text-sm text-navy-600 dark:text-navy-300">
            {programSlug || (serviceSlug && !serviceUsesVisaForm(serviceSlug))
              ? "Complete only the details and documents required for this service."
              : `Complete the application form for this request. ${PASSPORT_MATCH_NOTE}`}
          </p>
          <div className="min-w-0 overflow-hidden rounded-2xl border border-navy-100 bg-white p-4 shadow-xl sm:p-8 dark:border-navy-800 dark:bg-navy-900">
            {programSlug ? (
              <DarboiApplicationForm
                contextLabel={label}
                submitLabel="Submit & Contact via WhatsApp"
                showPaymentInfo={false}
                onSubmit={async (data, files) => {
                  try {
                    const slug = programSlug || "consultation";
                    const form = mapDarboiToApplicationData(data);
                    const allFiles = [...files.passportPhoto, ...files.passportBioPage];
                    await submitAndOpenWhatsApp(slug, label, form, allFiles);
                  } catch (err) {
                    toast.error(
                      err instanceof Error
                        ? err.message
                        : "Could not save your application. Please try again or contact us on WhatsApp."
                    );
                  }
                }}
              />
            ) : serviceSlug ? (
              <ApplicationSubmitFlow storageSlug={serviceSlug} serviceName={label}>
                {({ onSubmit, submitLabel, deferPaymentToModal, disabled }) => (
                  <ApplicationForm
                    serviceSlug={serviceSlug}
                    serviceTitle={label}
                    onSubmit={onSubmit}
                    submitLabel={submitLabel}
                    deferPaymentToModal={deferPaymentToModal}
                    disabled={disabled}
                  />
                )}
              </ApplicationSubmitFlow>
            ) : (
              <DarboiApplicationForm
                contextLabel={label}
                submitLabel="Submit & Contact via WhatsApp"
                showPaymentInfo={false}
                onSubmit={async (data, files) => {
                  try {
                    const form = mapDarboiToApplicationData(data);
                    const allFiles = [...files.passportPhoto, ...files.passportBioPage];
                    await submitAndOpenWhatsApp("consultation", label, form, allFiles);
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Failed to submit");
                  }
                }}
              />
            )}
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
