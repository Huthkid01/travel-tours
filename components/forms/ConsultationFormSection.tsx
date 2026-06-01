"use client";

import { ApplicationSubmitFlow } from "@/components/forms/ApplicationSubmitFlow";
import { DarboiApplicationForm } from "@/components/forms/DarboiApplicationForm";
import { WhatsAppCTA } from "@/components/layout/WhatsAppCTA";
import { mapDarboiToApplicationData } from "@/lib/application-mapper";
import { CONSULTATION_PAYMENT_SETTINGS } from "@/lib/consultation-payment";
import { getConsultationWhatsAppMessage } from "@/lib/whatsapp";
import type { DarboiApplicationFormValues } from "@/lib/validations";
import type { DarboiApplicationFiles } from "@/components/forms/DarboiApplicationForm";

export interface ConsultationFormSectionProps {
  title?: string;
  description?: string;
}

export function ConsultationFormSection({
  title = "Consultation Form",
  description = "Complete all steps. On step 5, pay by bank transfer to submit your application and open WhatsApp.",
}: ConsultationFormSectionProps) {
  const label = "General Consultation";

  const mapAndStage = (
    data: DarboiApplicationFormValues,
    files: DarboiApplicationFiles,
    onStageForPayment: (form: ReturnType<typeof mapDarboiToApplicationData>, allFiles: File[]) => void
  ) => {
    const allFiles = [...files.passportPhoto, ...files.passportBioPage];
    onStageForPayment(mapDarboiToApplicationData(data), allFiles);
  };

  return (
    <section className="rounded-2xl border border-navy-100 bg-white p-4 shadow-xl sm:p-6 dark:border-navy-800 dark:bg-navy-900">
      <h2 className="font-display text-xl font-bold text-navy-900 sm:text-2xl dark:text-white">{title}</h2>
      {description && <p className="mt-2 text-sm text-navy-600 sm:text-base dark:text-navy-300">{description}</p>}
      <p className="mt-2 text-sm font-medium text-gold-600 dark:text-gold-400">
        Consultation fee: {CONSULTATION_PAYMENT_SETTINGS.feeAmountLabel}
      </p>
      <div className="mt-4 min-w-0 overflow-hidden rounded-xl border border-navy-200 sm:mt-6 dark:border-navy-700">
        <div className="p-4 sm:p-6">
          <ApplicationSubmitFlow
            storageSlug="consultation"
            serviceName={label}
            kind="consultation"
            paymentSettings={CONSULTATION_PAYMENT_SETTINGS}
            submitAfterPayment
          >
            {({
              onStageForPayment,
              onStepProgress,
              submitLabel,
              deferPaymentToModal,
              paymentStepOpensModal,
              disabled,
            }) => (
              <DarboiApplicationForm
                contextLabel={label}
                submitLabel={submitLabel}
                showPaymentInfo={false}
                deferPaymentToModal={deferPaymentToModal}
                paymentStepOpensModal={paymentStepOpensModal}
                paymentFeeLabel={CONSULTATION_PAYMENT_SETTINGS.feeAmountLabel}
                disabled={disabled}
                onStageForPayment={(data, files) => mapAndStage(data, files, onStageForPayment)}
                onStepComplete={(data) => onStepProgress(mapDarboiToApplicationData(data))}
                onSubmit={async () => {}}
              />
            )}
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
  );
}
