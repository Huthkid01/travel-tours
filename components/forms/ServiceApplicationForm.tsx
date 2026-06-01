"use client";

import { CountrySelect } from "@/components/forms/CountrySelect";
import { DarboiFormHeader } from "@/components/forms/DarboiFormHeader";
import { FormStepFlow, type FormStepConfig } from "@/components/forms/FormStepFlow";
import { formInputClass, formLabelClass } from "@/components/forms/form-step-styles";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { DocumentUpload } from "@/components/upload/DocumentUpload";
import type { ServiceApplicationFormConfig } from "@/data/service-application-forms";
import { MARITAL_STATUS_OPTIONS, SEX_OPTIONS } from "@/data/darboi-application-form";
import {
  buildServiceApplicationSchema,
  type ServiceApplicationFormValues,
} from "@/lib/service-application-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, FileUp, MapPin, User, ClipboardList } from "lucide-react";
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
  deferPaymentToModal?: boolean;
  disabled?: boolean;
  onSubmit: (data: ServiceApplicationFormValues, files: File[]) => Promise<void>;
  onStepComplete?: (data: ServiceApplicationFormValues, stepId: string) => void;
}

type StepDef = FormStepConfig & { fieldKeys?: (keyof ServiceApplicationFormValues)[]; kind: string };

export function ServiceApplicationForm({
  config,
  contextLabel,
  submitLabel = "Continue to Payment",
  deferPaymentToModal = false,
  disabled = false,
  onSubmit,
  onStepComplete,
}: ServiceApplicationFormProps) {
  const schema = useMemo(() => buildServiceApplicationSchema(config), [config]);
  const f = useMemo(() => config.fields ?? {}, [config.fields]);

  const steps = useMemo(() => {
    const list: StepDef[] = [
      {
        id: "personal",
        title: "Personal",
        description: "Your legal name and identity",
        icon: User,
        kind: "personal",
        fieldKeys: [
          "fullLegalName",
          ...(f.dateOfBirth ? (["dateOfBirth"] as const) : []),
          ...(f.maritalStatus ? (["maritalStatus"] as const) : []),
          ...(f.sex ? (["sex"] as const) : []),
        ],
      },
      {
        id: "contact",
        title: "Contact",
        description: "Address and phone details",
        icon: MapPin,
        kind: "contact",
        fieldKeys: ["homeAddress", "email", "phone"],
      },
    ];

    const hasServiceFields =
      f.idNumber ||
      f.passportNumber ||
      f.travelDestination ||
      f.travelDates ||
      f.witnessOrAdditionalInfo ||
      config.purposeRequired !== false;

    if (hasServiceFields) {
      list.push({
        id: "service",
        title: "Service details",
        description: "Information for your application",
        icon: ClipboardList,
        kind: "service",
        fieldKeys: [
          ...(f.idNumber && f.idNumberRequired ? (["idOrPassportNumber"] as const) : []),
          ...(f.passportNumber ? (["passportNumber"] as const) : []),
          ...(f.travelDestination ? (["travelDestination"] as const) : []),
          ...(f.travelDates ? (["travelDates"] as const) : []),
          ...(config.purposeRequired !== false ? (["purposeDetails"] as const) : []),
          ...(f.witnessOrAdditionalInfo ? (["witnessOrAdditionalInfo"] as const) : []),
        ],
      });
    }

    if ((config.uploads ?? []).length > 0) {
      list.push({
        id: "documents",
        title: "Documents",
        description: "Upload required files",
        icon: FileUp,
        kind: "documents",
      });
    }

    if (config.showPaymentInfo !== false && !deferPaymentToModal) {
      list.push({
        id: "payment",
        title: "Payment",
        description: "Bank transfer & reference",
        icon: CreditCard,
        kind: "payment",
        fieldKeys: ["paymentReference"],
      });
    }

    return list;
  }, [config, f, deferPaymentToModal]);

  const [step, setStep] = useState(0);
  const [uploads, setUploads] = useState<Record<string, File[]>>(() =>
    Object.fromEntries((config.uploads ?? []).map((u) => [u.key, []]))
  );
  const [uploadErrors, setUploadErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);
  const track = useLeadTrackerContext();

  const lastStepIndex = steps.length - 1;
  const stepDef = steps[step];

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ServiceApplicationFormValues>({
    resolver: zodResolver(schema),
  });

  const validateUploads = () => {
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
    return valid;
  };

  const submit = async (data: ServiceApplicationFormValues) => {
    if (!validateUploads()) {
      const docIdx = steps.findIndex((s) => s.kind === "documents");
      if (docIdx >= 0) setStep(docIdx);
      return;
    }

    const allFiles = (config.uploads ?? []).flatMap((u) => uploads[u.key] ?? []);
    setLoading(true);
    track({ actionType: "form_submit", service: contextLabel, source: "service_application_form" });
    try {
      await onSubmit(data, allFiles);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (stepDef.kind === "documents") {
      if (!validateUploads()) return;
      if (step < lastStepIndex) {
        onStepComplete?.(getValues(), stepDef.id);
        setStep((s) => s + 1);
        return;
      }
      void handleSubmit(submit)();
      return;
    }

    if (step === lastStepIndex) {
      void handleSubmit(submit)();
      return;
    }

    const keys = stepDef.fieldKeys ?? [];
    if (keys.length > 0) {
      const ok = await trigger(keys);
      if (!ok) return;
    }
    onStepComplete?.(getValues(), stepDef.id);
    setStep((s) => s + 1);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="min-w-0 max-w-full overflow-x-hidden">
      <DarboiFormHeader contextLabel={contextLabel} />
      {config.headerNote && (
        <p className="mt-4 rounded-xl border border-gold-500/20 bg-gold-500/5 px-4 py-3 text-sm text-navy-700 dark:text-navy-200">
          {config.headerNote}
        </p>
      )}

      <div className="mt-6">
        <FormStepFlow
          flowTitle="Application"
          flowSubtitle={contextLabel}
          steps={steps}
          currentStep={step}
          onBack={() => setStep((s) => Math.max(0, s - 1))}
          onContinue={handleContinue}
          continueLabel={step === lastStepIndex ? submitLabel : undefined}
          isLastStep={step === lastStepIndex}
          isSubmitting={loading || disabled}
          showBack={step > 0}
        >
          {stepDef.kind === "personal" && (
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
              <div className="sm:col-span-2">
                <label className={formLabelClass}>Full legal name *</label>
                <input {...register("fullLegalName")} className={formInputClass} placeholder="As on your ID" />
                {fieldErrorMessage(errors.fullLegalName) && (
                  <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.fullLegalName)}</p>
                )}
              </div>
              {f.dateOfBirth && (
                <div className="min-w-0 overflow-hidden">
                  <label className={formLabelClass}>Date of birth *</label>
                  <input {...register("dateOfBirth")} type="date" className={formInputClass} />
                  {fieldErrorMessage(errors.dateOfBirth) && (
                    <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.dateOfBirth)}</p>
                  )}
                </div>
              )}
              {f.maritalStatus && (
                <div>
                  <label className={formLabelClass}>Marital status *</label>
                  <select {...register("maritalStatus")} className={formInputClass} defaultValue="">
                    <option value="" disabled>Choose</option>
                    {MARITAL_STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  {fieldErrorMessage(errors.maritalStatus) && (
                    <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.maritalStatus)}</p>
                  )}
                </div>
              )}
              {f.sex && (
                <div className="sm:col-span-2">
                  <span className={formLabelClass}>Sex *</span>
                  <div className="mt-2 flex flex-wrap gap-6">
                    {SEX_OPTIONS.map((o) => (
                      <label key={o.value} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-navy-800 dark:text-navy-200">
                        <input type="radio" value={o.value} {...register("sex")} className="h-4 w-4 text-gold-500" />
                        {o.label}
                      </label>
                    ))}
                  </div>
                  {fieldErrorMessage(errors.sex) && (
                    <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.sex)}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {stepDef.kind === "contact" && (
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
              <div className="sm:col-span-2">
                <label className={formLabelClass}>Home address *</label>
                <input {...register("homeAddress")} className={formInputClass} placeholder="Full residential address" />
                {fieldErrorMessage(errors.homeAddress) && (
                  <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.homeAddress)}</p>
                )}
              </div>
              <div>
                <label className={formLabelClass}>Email address *</label>
                <input {...register("email")} type="email" className={formInputClass} placeholder="your@email.com" />
                {fieldErrorMessage(errors.email) && (
                  <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.email)}</p>
                )}
              </div>
              <div>
                <label className={formLabelClass}>Phone number *</label>
                <input {...register("phone")} type="tel" className={formInputClass} placeholder="08038178843" />
                {fieldErrorMessage(errors.phone) && (
                  <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.phone)}</p>
                )}
              </div>
            </div>
          )}

          {stepDef.kind === "service" && (
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
              {f.idNumber && (
                <div className="sm:col-span-2">
                  <label className={formLabelClass}>
                    {f.idNumberLabel ?? "ID number"}
                    {f.idNumberRequired ? " *" : ""}
                  </label>
                  <input {...register("idOrPassportNumber")} className={formInputClass} placeholder={f.idNumberLabel ?? "National ID or passport"} />
                  {fieldErrorMessage(errors.idOrPassportNumber) && (
                    <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.idOrPassportNumber)}</p>
                  )}
                </div>
              )}
              {f.passportNumber && (
                <div className="sm:col-span-2">
                  <label className={formLabelClass}>Passport number *</label>
                  <input {...register("passportNumber")} className={formInputClass} />
                  {fieldErrorMessage(errors.passportNumber) && (
                    <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.passportNumber)}</p>
                  )}
                </div>
              )}
              {f.travelDestination && (
                <div>
                  <label className={formLabelClass} htmlFor="travelDestination">Destination country *</label>
                  <CountrySelect
                    id="travelDestination"
                    registration={register("travelDestination")}
                    className={formInputClass}
                    placeholder="Select destination country"
                    error={fieldErrorMessage(errors.travelDestination)}
                  />
                </div>
              )}
              {f.travelDates && (
                <div>
                  <label className={formLabelClass}>Travel dates *</label>
                  <input {...register("travelDates")} className={formInputClass} placeholder="e.g. 15 Jun – 30 Jun 2026" />
                  {fieldErrorMessage(errors.travelDates) && (
                    <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.travelDates)}</p>
                  )}
                </div>
              )}
              {f.witnessOrAdditionalInfo && (
                <div className="sm:col-span-2">
                  <label className={formLabelClass}>{config.purposeLabel ?? "Witness / additional info"}</label>
                  <textarea {...register("witnessOrAdditionalInfo")} rows={3} className={formInputClass} placeholder={config.purposePlaceholder} />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className={formLabelClass}>
                  {config.purposeLabel ?? "Additional details"}
                  {config.purposeRequired !== false ? " *" : ""}
                </label>
                <textarea {...register("purposeDetails")} rows={3} className={formInputClass} placeholder={config.purposePlaceholder ?? "Brief description"} />
                {fieldErrorMessage(errors.purposeDetails) && (
                  <p className="mt-1 text-sm text-red-500">{fieldErrorMessage(errors.purposeDetails)}</p>
                )}
              </div>
            </div>
          )}

          {stepDef.kind === "documents" && (
            <div className="grid min-w-0 gap-6 sm:grid-cols-2">
              {(config.uploads ?? []).map((field) => (
                <div key={field.key} className={(config.uploads ?? []).length === 1 ? "sm:col-span-2" : undefined}>
                  <label className={formLabelClass}>
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
          )}

        </FormStepFlow>
      </div>
    </form>
  );
}
