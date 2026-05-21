"use client";

import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { DarboiApplicationForm } from "@/components/forms/DarboiApplicationForm";
import { WhatsAppCTA } from "@/components/layout/WhatsAppCTA";
import { serviceUsesVisaForm } from "@/data/service-application-forms";
import {
  getApplicationWhatsAppMessage,
  getConsultationWhatsAppMessage,
  redirectToWhatsApp,
} from "@/lib/whatsapp";
import { mapDarboiToApplicationData } from "@/lib/application-mapper";
import { submitApplicationWithNotify } from "@/lib/submit-application";
import { getProgramBySlug } from "@/data/programs";
import { services } from "@/data/services";
import { PASSPORT_MATCH_NOTE } from "@/data/darboi-application-form";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useMemo } from "react";
import { toast } from "sonner";

function ConsultationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const programSlug = searchParams.get("program");
  const serviceSlug = searchParams.get("service");

  const { label, paymentHref } = useMemo(() => {
    if (programSlug) {
      const program = getProgramBySlug(programSlug);
      return {
        label: program?.title ?? programSlug,
        paymentHref: undefined as string | undefined,
      };
    }
    if (serviceSlug) {
      const service = services.find((s) => s.slug === serviceSlug);
      return {
        label: service?.title ?? serviceSlug,
        paymentHref: `/services/${serviceSlug}/apply`,
      };
    }
    return { label: "General Consultation", paymentHref: undefined as string | undefined };
  }, [programSlug, serviceSlug]);

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
          <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xl sm:p-8 dark:border-navy-800 dark:bg-navy-900">
            {programSlug ? (
              <DarboiApplicationForm
                contextLabel={label}
                submitLabel="Submit & Contact via WhatsApp"
                showPaymentInfo
                onSubmit={async (data, files) => {
                  try {
                    const slug = programSlug || "consultation";
                    const form = mapDarboiToApplicationData(data);
                    const allFiles = [...files.passportPhoto, ...files.passportBioPage];
                    const { application, emailSent } = await submitApplicationWithNotify(
                      slug,
                      label,
                      form,
                      allFiles
                    );
                    if (!emailSent) {
                      toast.warning("Application saved; email notification could not be sent.");
                    } else {
                      toast.success("Application sent to Darboi Consults!");
                    }
                    redirectToWhatsApp(
                      getApplicationWhatsAppMessage({
                        applicationId: application.id,
                        serviceName: label,
                        applicantName: application.full_name,
                      })
                    );
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Failed to submit");
                  }
                }}
              />
            ) : serviceSlug ? (
              <ApplicationForm
                serviceSlug={serviceSlug}
                serviceTitle={label}
                onSubmit={async (data, files) => {
                  if (paymentHref) {
                    try {
                      const { application, emailSent } = await submitApplicationWithNotify(
                        serviceSlug,
                        label,
                        data,
                        files
                      );
                      sessionStorage.setItem("pending_application_id", application.id);
                      if (emailSent) {
                        toast.success("Application sent! Continue to payment.");
                      } else {
                        toast.success("Application saved. Continue to payment.");
                      }
                      router.push(`${paymentHref}/payment?applicationId=${application.id}`);
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Failed to save application");
                    }
                    return;
                  }

                  try {
                    const { application, emailSent } = await submitApplicationWithNotify(
                      serviceSlug,
                      label,
                      data,
                      files
                    );
                    if (!emailSent) toast.warning("Application saved; email could not be sent.");
                    else toast.success("Application sent!");
                    redirectToWhatsApp(
                      getApplicationWhatsAppMessage({
                        applicationId: application.id,
                        serviceName: label,
                        applicantName: application.full_name,
                      })
                    );
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Failed to submit");
                  }
                }}
              />
            ) : (
              <DarboiApplicationForm
                contextLabel={label}
                submitLabel="Submit & Contact via WhatsApp"
                showPaymentInfo
                onSubmit={async (data, files) => {
                  try {
                    const form = mapDarboiToApplicationData(data);
                    const allFiles = [...files.passportPhoto, ...files.passportBioPage];
                    const { application, emailSent } = await submitApplicationWithNotify(
                      "consultation",
                      label,
                      form,
                      allFiles
                    );
                    if (!emailSent) toast.warning("Application saved; email could not be sent.");
                    else toast.success("Application sent!");
                    redirectToWhatsApp(
                      getApplicationWhatsAppMessage({
                        applicationId: application.id,
                        serviceName: label,
                        applicantName: application.full_name,
                      })
                    );
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

export default function ConsultationPage() {
  return (
    <Suspense fallback={<div className="container-custom py-32 text-center">Loading consultation...</div>}>
      <ConsultationContent />
    </Suspense>
  );
}
