"use client";

import { DarboiFormHeader } from "@/components/forms/DarboiFormHeader";
import { PaymentInfoBlock } from "@/components/forms/PaymentInfoBlock";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { DocumentUpload } from "@/components/upload/DocumentUpload";
import { Button } from "@/components/ui/Button";
import { MARITAL_STATUS_OPTIONS, SEX_OPTIONS } from "@/data/darboi-application-form";
import { darboiApplicationSchema, type DarboiApplicationFormValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export interface DarboiApplicationFiles {
  passportPhoto: File[];
  passportBioPage: File[];
}

export interface DarboiApplicationFormProps {
  contextLabel?: string;
  submitLabel?: string;
  showPaymentInfo?: boolean;
  onSubmit: (data: DarboiApplicationFormValues, files: DarboiApplicationFiles) => Promise<void>;
}

export function DarboiApplicationForm({
  contextLabel,
  submitLabel = "Submit Application",
  showPaymentInfo = true,
  onSubmit,
}: DarboiApplicationFormProps) {
  const [passportPhoto, setPassportPhoto] = useState<File[]>([]);
  const [passportBioPage, setPassportBioPage] = useState<File[]>([]);
  const [passportPhotoError, setPassportPhotoError] = useState<string>();
  const [passportBioError, setPassportBioError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const track = useLeadTrackerContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DarboiApplicationFormValues>({
    resolver: zodResolver(darboiApplicationSchema),
  });

  const inputClass = cn(
    "w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
  );

  const labelClass = "mb-1 block text-sm font-semibold uppercase tracking-wide text-navy-800 dark:text-navy-200";

  const submit = async (data: DarboiApplicationFormValues) => {
    let valid = true;
    if (passportPhoto.length === 0) {
      setPassportPhotoError("Passport photograph is required");
      valid = false;
    } else setPassportPhotoError(undefined);

    if (passportBioPage.length === 0) {
      setPassportBioError("International passport photo page is required");
      valid = false;
    } else setPassportBioError(undefined);

    if (!valid) return;

    setLoading(true);
    track({
      actionType: "form_submit",
      service: contextLabel ?? "application",
      source: "darboi_application_form",
    });

    try {
      await onSubmit(data, { passportPhoto, passportBioPage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <DarboiFormHeader contextLabel={contextLabel} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Full legal name *</label>
          <input {...register("fullLegalName")} className={inputClass} placeholder="As on passport" />
          {errors.fullLegalName && <p className="mt-1 text-sm text-red-500">{errors.fullLegalName.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Date of birth *</label>
          <input {...register("dateOfBirth")} type="date" className={inputClass} />
          {errors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Marital status *</label>
          <select {...register("maritalStatus")} className={inputClass} defaultValue="">
            <option value="" disabled>
              Choose
            </option>
            {MARITAL_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.maritalStatus && <p className="mt-1 text-sm text-red-500">{errors.maritalStatus.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <span className={labelClass}>Sex *</span>
          <div className="mt-2 flex flex-wrap gap-6">
            {SEX_OPTIONS.map((o) => (
              <label key={o.value} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-navy-800 dark:text-navy-200">
                <input
                  type="radio"
                  value={o.value}
                  {...register("sex")}
                  className="h-4 w-4 border-navy-300 text-gold-500 focus:ring-gold-500"
                />
                {o.label}
              </label>
            ))}
          </div>
          {errors.sex && <p className="mt-1 text-sm text-red-500">{errors.sex.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Home address *</label>
          <input {...register("homeAddress")} className={inputClass} placeholder="Full residential address" />
          {errors.homeAddress && <p className="mt-1 text-sm text-red-500">{errors.homeAddress.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Email address *</label>
          <input {...register("email")} type="email" className={inputClass} placeholder="your@email.com" />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Phone number *</label>
          <input {...register("phone")} type="tel" className={inputClass} placeholder="08038178843" />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Passport number *</label>
          <input {...register("passportNumber")} className={inputClass} placeholder="Passport number" />
          {errors.passportNumber && <p className="mt-1 text-sm text-red-500">{errors.passportNumber.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Passport photograph *</label>
          <p className="mb-2 text-xs text-navy-500">
            Up to 5 files — PDF, document, or image. Max 10 MB per file.
          </p>
          <DocumentUpload files={passportPhoto} onChange={setPassportPhoto} error={passportPhotoError} maxFiles={5} />
        </div>

        <div>
          <label className={labelClass}>International passport photo page *</label>
          <p className="mb-2 text-xs text-navy-500">
            Up to 5 files — PDF, document, or image. Max 10 MB per file.
          </p>
          <DocumentUpload files={passportBioPage} onChange={setPassportBioPage} error={passportBioError} maxFiles={5} />
        </div>

        <div>
          <label className={labelClass}>Country of choice *</label>
          <input {...register("countryOfChoice")} className={inputClass} placeholder="e.g. Canada, UK" />
          {errors.countryOfChoice && <p className="mt-1 text-sm text-red-500">{errors.countryOfChoice.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Preferred programme of study *</label>
          <input {...register("preferredProgramme")} className={inputClass} placeholder="Your programme" />
          {errors.preferredProgramme && (
            <p className="mt-1 text-sm text-red-500">{errors.preferredProgramme.message}</p>
          )}
        </div>
      </div>

      {showPaymentInfo && (
        <>
          <PaymentInfoBlock />
          <div>
            <label className={labelClass}>Payment reference / depositor name</label>
            <input
              {...register("paymentReference")}
              className={inputClass}
              placeholder="Transfer reference or name used"
            />
          </div>
        </>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
