"use client";

import {
  DarboiApplicationForm,
  type DarboiApplicationFiles,
} from "@/components/forms/DarboiApplicationForm";
import { ServiceApplicationForm } from "@/components/forms/ServiceApplicationForm";
import {
  getServiceApplicationConfig,
  serviceUsesVisaForm,
} from "@/data/service-application-forms";
import { mapDarboiToApplicationData } from "@/lib/application-mapper";
import { mapServiceToApplicationData } from "@/lib/service-application-mapper";
import type { DarboiApplicationFormValues } from "@/lib/validations";
import type { ServiceApplicationFormValues } from "@/lib/service-application-schema";
import type { ApplicationFormData } from "@/types";

interface ApplicationFormProps {
  serviceSlug: string;
  serviceTitle: string;
  submitLabel?: string;
  deferPaymentToModal?: boolean;
  paymentStepOpensModal?: boolean;
  paymentFeeLabel?: string;
  disabled?: boolean;
  onSubmit: (data: ApplicationFormData, files: File[]) => Promise<void>;
  onStageForPayment?: (data: ApplicationFormData, files: File[]) => void;
}

export function ApplicationForm({
  serviceSlug,
  serviceTitle,
  submitLabel = "Submit Application",
  deferPaymentToModal = false,
  paymentStepOpensModal = false,
  paymentFeeLabel,
  disabled = false,
  onSubmit,
  onStageForPayment,
}: ApplicationFormProps) {
  const contextLabel = `Applying for: ${serviceTitle}`;

  if (serviceUsesVisaForm(serviceSlug)) {
    const handleVisaSubmit = async (
      data: DarboiApplicationFormValues,
      { passportPhoto, passportBioPage }: DarboiApplicationFiles
    ) => {
      await onSubmit(mapDarboiToApplicationData(data), [...passportPhoto, ...passportBioPage]);
    };

    const handleVisaStage = (
      data: DarboiApplicationFormValues,
      files: DarboiApplicationFiles
    ) => {
      onStageForPayment?.(mapDarboiToApplicationData(data), [...files.passportPhoto, ...files.passportBioPage]);
    };

    return (
      <DarboiApplicationForm
        contextLabel={contextLabel}
        submitLabel={submitLabel}
        showPaymentInfo={!deferPaymentToModal && !paymentStepOpensModal}
        deferPaymentToModal={deferPaymentToModal}
        paymentStepOpensModal={paymentStepOpensModal}
        paymentFeeLabel={paymentFeeLabel}
        disabled={disabled}
        onSubmit={handleVisaSubmit}
        onStageForPayment={onStageForPayment ? handleVisaStage : undefined}
      />
    );
  }

  const config = getServiceApplicationConfig(serviceSlug);

  const handleServiceSubmit = async (data: ServiceApplicationFormValues, files: File[]) => {
    await onSubmit(mapServiceToApplicationData(data, config, serviceTitle), files);
  };

  return (
    <ServiceApplicationForm
      config={config}
      contextLabel={contextLabel}
      submitLabel={submitLabel}
      deferPaymentToModal={deferPaymentToModal}
      disabled={disabled}
      onSubmit={handleServiceSubmit}
    />
  );
}
