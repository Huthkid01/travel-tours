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
  onSubmit: (data: ApplicationFormData, files: File[]) => Promise<void>;
}

export function ApplicationForm({ serviceSlug, serviceTitle, onSubmit }: ApplicationFormProps) {
  const contextLabel = `Applying for: ${serviceTitle}`;

  if (serviceUsesVisaForm(serviceSlug)) {
    const handleVisaSubmit = async (
      data: DarboiApplicationFormValues,
      { passportPhoto, passportBioPage }: DarboiApplicationFiles
    ) => {
      await onSubmit(mapDarboiToApplicationData(data), [...passportPhoto, ...passportBioPage]);
    };

    return (
      <DarboiApplicationForm
        contextLabel={contextLabel}
        submitLabel="Continue to Payment"
        showPaymentInfo
        onSubmit={handleVisaSubmit}
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
      submitLabel="Continue to Payment"
      onSubmit={handleServiceSubmit}
    />
  );
}
