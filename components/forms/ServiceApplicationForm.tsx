"use client";

import { DarboiFormHeader } from "@/components/forms/DarboiFormHeader";
import { PaymentInfoBlock } from "@/components/forms/PaymentInfoBlock";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { DocumentUpload } from "@/components/upload/DocumentUpload";
import { Button } from "@/components/ui/Button";
import type { ServiceApplicationFormConfig } from "@/data/service-application-forms";
import { MARITAL_STATUS_OPTIONS, SEX_OPTIONS } from "@/data/darboi-application-form";
import {
  buildServiceApplicationSchema,
  type ServiceApplicationFormValues,
} from "@/lib/service-application-schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

function fieldErrorMessage(error: unknown): string | undefined {
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    return typeof msg === "string" ? msg : undefined;
  }
  return undefined;
}

interface ServiceApplicationFormProps {
  config: ServiceApplicationFormConfig;
  contextLabel: string;
  submitLabel?: string;
  onSubmit: (data: ServiceApplicationFormValues, files: File[]) => Promise<void>;
}

export function ServiceApplicationForm({
  config,
  contextLabel,
  submitLabel = "Continue to Payment",
  onSubmit,
}: ServiceApplicationFormProps) {
  const schema = useMemo(() => buildServiceApplicationSchema(config), [config]);
  const [uploads, setUploads] = useState<Record<string, File[]>>(() =>
    Object.fromEntries((config.uploads ?? []).map((u) => [u.key, []]))
  );
  const [uploadErrors, setUploadErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);
  const track = useLeadTrackerContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceApplicationFormValues>({
    resolver: zodResolver(schema),
  });

  const inputClass = cn(
    "w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
  );
  const labelClass = "mb-1 block text-sm font-semibold uppercase tracking-wide text-navy-800 dark:text-navy-200";

  const submit = async (data: ServiceApplicationFormValues) => {
    const nextErrors: Record<string, string | undefined> = {};
    let valid = true;

    for (const field of config.uploads ?? []) {
      if (field.required && (uploads[field.key]?.length ?? 0) === 0) {
        nextErrors[field.key] = `${field.label} is required`;
        valid = false;
      } else {
        nextErrors[field.key] = undefined;
      }
    }
    setUploadErrors(nextErrors);
    if (!valid) return;

    const allFiles = (config.uploads ?? []).flatMap((u) => uploads[u.key] ?? []);

    setLoading(true);
    track({
      actionType: "form_submit",
      service: contextLabel,
      source: "service_application_form",
    });

    try {
      await onSubmit(data, allFiles);
    } finally {
      setLoading(false);
    }
  };

  const f = config.fields ?? {};

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <DarboiFormHeader contextLabel={contextLabel} />
      {config.headerNote && (
        <p className="rounded-xl border border-gold-500/20 bg-gold-500/5 px-4 py-3 text-sm text-navy-700 dark:text-navy-200">
          {config.headerNote}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Full legal name *</label>
          <input {...register("fullLegalName")} className={inputClass} placeholder="As on your ID" />
          {fieldErrorMessage(errors.fullLegalName) && (
            <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.fullLegalName)}</p>
          )}
        </div>

        {f.dateOfBirth && (
          <div>
            <label className={labelClass}>Date of birth *</label>
            <input {...register("dateOfBirth")} type="date" className={inputClass} />
            {fieldErrorMessage(errors.dateOfBirth) && (
              <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.dateOfBirth)}</p>
            )}
          </div>
        )}

        {f.maritalStatus && (
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
            {fieldErrorMessage(errors.maritalStatus) && (
              <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.maritalStatus)}</p>
            )}
          </div>
        )}

        {f.sex && (
          <div className="sm:col-span-2">
            <span className={labelClass}>Sex *</span>
            <div className="mt-2 flex flex-wrap gap-6">
              {SEX_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium text-navy-800 dark:text-navy-200"
                >
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
            {fieldErrorMessage(errors.sex) && (
              <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.sex)}</p>
            )}
          </div>
        )}

        <div className="sm:col-span-2">
          <label className={labelClass}>Home address *</label>
          <input {...register("homeAddress")} className={inputClass} placeholder="Full residential address" />
          {fieldErrorMessage(errors.homeAddress) && (
            <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.homeAddress)}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Email address *</label>
          <input {...register("email")} type="email" className={inputClass} placeholder="your@email.com" />
          {fieldErrorMessage(errors.email) && (
            <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.email)}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Phone number *</label>
          <input {...register("phone")} type="tel" className={inputClass} placeholder="08038178843" />
          {fieldErrorMessage(errors.phone) && (
            <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.phone)}</p>
          )}
        </div>

        {f.idNumber && (
          <div className="sm:col-span-2">
            <label className={labelClass}>
              {f.idNumberLabel ?? "ID number"}
              {f.idNumberRequired ? " *" : ""}
            </label>
            <input
              {...register("idOrPassportNumber")}
              className={inputClass}
              placeholder={f.idNumberLabel ?? "National ID or passport"}
            />
            {fieldErrorMessage(errors.idOrPassportNumber) && (
              <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.idOrPassportNumber)}</p>
            )}
          </div>
        )}

        {f.passportNumber && (
          <div className="sm:col-span-2">
            <label className={labelClass}>Passport number *</label>
            <input {...register("passportNumber")} className={inputClass} placeholder="Passport number" />
            {fieldErrorMessage(errors.passportNumber) && (
              <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.passportNumber)}</p>
            )}
          </div>
        )}

        {f.travelDestination && (
          <div>
            <label className={labelClass}>Destination *</label>
            <input {...register("travelDestination")} className={inputClass} placeholder="Country or city" />
            {fieldErrorMessage(errors.travelDestination) && (
              <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.travelDestination)}</p>
            )}
          </div>
        )}

        {f.travelDates && (
          <div>
            <label className={labelClass}>Travel dates *</label>
            <input {...register("travelDates")} className={inputClass} placeholder="e.g. 15 Jun – 30 Jun 2026" />
            {fieldErrorMessage(errors.travelDates) && (
              <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.travelDates)}</p>
            )}
          </div>
        )}

        {f.witnessOrAdditionalInfo && (
          <div className="sm:col-span-2">
            <label className={labelClass}>{config.purposeLabel ?? "Witness / additional info"}</label>
            <textarea
              {...register("witnessOrAdditionalInfo")}
              rows={3}
              className={inputClass}
              placeholder={config.purposePlaceholder}
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label className={labelClass}>
            {config.purposeLabel ?? "Additional details"}
            {config.purposeRequired !== false ? " *" : ""}
          </label>
          <textarea
            {...register("purposeDetails")}
            rows={3}
            className={inputClass}
            placeholder={config.purposePlaceholder ?? "Brief description"}
          />
          {fieldErrorMessage(errors.purposeDetails) && (
            <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.purposeDetails)}</p>
          )}
        </div>

        {(config.uploads ?? []).map((field) => (
          <div
            key={field.key}
            className={(config.uploads ?? []).length === 1 ? "sm:col-span-2" : undefined}
          >
            <label className={labelClass}>
              {field.label}
              {field.required ? " *" : ""}
            </label>
            {field.hint && <p className="mb-2 text-xs text-navy-500">{field.hint}</p>}
            <DocumentUpload
              files={uploads[field.key] ?? []}
              onChange={(files) => setUploads((prev) => ({ ...prev, [field.key]: files }))}
              error={uploadErrors[field.key]}
              maxFiles={5}
            />
          </div>
        ))}
      </div>

      {config.showPaymentInfo !== false && (
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
