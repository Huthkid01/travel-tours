"use client";

import {
  DarboiApplicationForm,
  type DarboiApplicationFiles,
} from "@/components/forms/DarboiApplicationForm";
import { mapDarboiToApplicationData } from "@/lib/application-mapper";
import type { DarboiApplicationFormValues } from "@/lib/validations";
import type { ApplicationFormData } from "@/types";

interface ApplicationFormProps {
  serviceTitle: string;
  onSubmit: (data: ApplicationFormData, files: File[]) => Promise<void>;
}

export function ApplicationForm({ serviceTitle, onSubmit }: ApplicationFormProps) {
  const handleSubmit = async (
    data: DarboiApplicationFormValues,
    { passportPhoto, passportBioPage }: DarboiApplicationFiles
  ) => {
    await onSubmit(mapDarboiToApplicationData(data), [...passportPhoto, ...passportBioPage]);
  };

  return (
    <DarboiApplicationForm
      contextLabel={`Applying for: ${serviceTitle}`}
      submitLabel="Continue to Payment"
      showPaymentInfo
      onSubmit={handleSubmit}
    />
  );
}
