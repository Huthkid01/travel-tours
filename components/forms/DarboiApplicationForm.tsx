"use client";

import { DarboiFormHeader } from "@/components/forms/DarboiFormHeader";
import { FormStepFlow, type FormStepConfig } from "@/components/forms/FormStepFlow";
import { formInputClass, formLabelClass } from "@/components/forms/form-step-styles";
import { CountrySelect } from "@/components/forms/CountrySelect";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { DocumentUpload } from "@/components/upload/DocumentUpload";
import { MARITAL_STATUS_OPTIONS, SEX_OPTIONS } from "@/data/darboi-application-form";
import { MAX_UPLOAD_TOTAL_MB } from "@/lib/constants";
import { darboiApplicationSchema, type DarboiApplicationFormValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, FileUp, MapPin, Plane, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface DarboiApplicationFiles {
  passportPhoto: File[];
  passportBioPage: File[];
}

export interface DarboiApplicationFormProps {
  contextLabel?: string;
  submitLabel?: string;
  showPaymentInfo?: boolean;
  /** When true, payment step is omitted; parent shows bank details in a modal after submit */
  deferPaymentToModal?: boolean;
  /** Step 5: Make payment — opens bank modal instead of submitting inline */
  paymentStepOpensModal?: boolean;
  paymentFeeLabel?: string;
  disabled?: boolean;
  onSubmit: (data: DarboiApplicationFormValues, files: DarboiApplicationFiles) => Promise<void>;
  /** Called on step 5 when user taps Make payment (after validation) */
  onStageForPayment?: (data: DarboiApplicationFormValues, files: DarboiApplicationFiles) => void | Promise<void>;
  /** Called after each step is validated — parent can save draft */
  onStepComplete?: (data: DarboiApplicationFormValues, stepId: string) => void;
}

const STEPS: FormStepConfig[] = [
  { id: "personal", title: "Personal", description: "Your legal name and identity details", icon: User },
  { id: "contact", title: "Contact", description: "How we can reach you", icon: MapPin },
  { id: "travel", title: "Travel", description: "Destination and programme", icon: Plane },
  { id: "documents", title: "Documents", description: "Upload passport files", icon: FileUp },
  { id: "payment", title: "Payment", description: "Bank transfer & reference", icon: CreditCard },
];

const STEP_FIELDS: (keyof DarboiApplicationFormValues)[][] = [
  ["fullLegalName", "dateOfBirth", "maritalStatus", "sex"],
  ["homeAddress", "email", "phone"],
  ["passportNumber", "countryOfChoice", "preferredProgramme"],
  [],
  ["paymentReference"],
];

export function DarboiApplicationForm({
  contextLabel,
  submitLabel = "Submit Application",
  showPaymentInfo = true,
  deferPaymentToModal = false,
  paymentStepOpensModal = false,
  paymentFeeLabel,
  disabled = false,
  onSubmit,
  onStageForPayment,
  onStepComplete,
}: DarboiApplicationFormProps) {
  const [step, setStep] = useState(0);
  const [passportPhoto, setPassportPhoto] = useState<File[]>([]);
  const [passportBioPage, setPassportBioPage] = useState<File[]>([]);
  const [passportPhotoError, setPassportPhotoError] = useState<string>();
  const [passportBioError, setPassportBioError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const track = useLeadTrackerContext();

  const steps = (() => {
    if (paymentStepOpensModal) {
      return STEPS.map((s) =>
        s.id === "payment"
          ? { ...s, title: "Make payment", description: "Bank transfer to confirm your consultation" }
          : s
      );
    }
    if (showPaymentInfo && !deferPaymentToModal) return STEPS;
    return STEPS.filter((s) => s.id !== "payment");
  })();
  const lastStepIndex = steps.length - 1;

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm<DarboiApplicationFormValues>({
    resolver: zodResolver(darboiApplicationSchema),
    mode: "onTouched",
  });

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const subscription = watch((values) => {
      if (!onStepComplete) return;
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = setTimeout(() => {
        onStepComplete(values as DarboiApplicationFormValues, "autosave");
      }, 700);
    });
    return () => {
      subscription.unsubscribe();
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [watch, onStepComplete]);

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

    if (!valid) {
      setStep(steps.findIndex((s) => s.id === "documents"));
      return;
    }

    setLoading(true);
    track({
      actionType: "form_submit",
      service: contextLabel ?? "application",
      source: "darboi_application_form",
    });

    try {
      await onSubmit(data, { passportPhoto, passportBioPage });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submit failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateDocuments = () => {
    let valid = true;
    if (passportPhoto.length === 0) {
      setPassportPhotoError("Passport photograph is required");
      valid = false;
    } else setPassportPhotoError(undefined);
    if (passportBioPage.length === 0) {
      setPassportBioError("International passport photo page is required");
      valid = false;
    } else setPassportBioError(undefined);

    const totalBytes = [...passportPhoto, ...passportBioPage].reduce((sum, file) => sum + file.size, 0);
    const maxBytes = MAX_UPLOAD_TOTAL_MB * 1024 * 1024;
    if (totalBytes > maxBytes) {
      const msg = `Total upload size is ${(totalBytes / (1024 * 1024)).toFixed(1)} MB. Please use files under ${MAX_UPLOAD_TOTAL_MB} MB combined.`;
      setPassportPhotoError(msg);
      setPassportBioError(msg);
      toast.error(msg);
      valid = false;
    }

    return valid;
  };

  const handleContinue = async () => {
    const stepId = steps[step].id;

    if (stepId === "documents") {
      if (!validateDocuments()) {
        toast.error("Please upload both passport files before continuing.");
        return;
      }
      if (step < lastStepIndex) {
        onStepComplete?.(getValues(), stepId);
        setStep((s) => s + 1);
        return;
      }
      if (paymentStepOpensModal) return;
    }

    if (stepId === "payment" && paymentStepOpensModal) {
      if (!validateDocuments()) {
        toast.error("Please upload both passport files before payment.");
        const docIdx = steps.findIndex((s) => s.id === "documents");
        if (docIdx >= 0) setStep(docIdx);
        return;
      }
      const fieldsOk = await trigger();
      if (!fieldsOk) {
        toast.error("Please complete all required fields before payment.");
        for (let i = 0; i < STEP_FIELDS.length; i++) {
          const fields = STEP_FIELDS[i];
          if (!fields.length) continue;
          const stepOk = await trigger(fields);
          if (!stepOk) {
            const targetId = STEPS[i]?.id;
            const targetIndex = steps.findIndex((s) => s.id === targetId);
            if (targetIndex >= 0) setStep(targetIndex);
            break;
          }
        }
        return;
      }
      setLoading(true);
      try {
        await onStageForPayment?.(getValues(), { passportPhoto, passportBioPage });
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === lastStepIndex) {
      if (!validateDocuments()) return;
      const fieldsOk = await trigger();
      if (!fieldsOk) {
        toast.error("Please complete all required fields before submitting.");
        for (let i = 0; i < STEP_FIELDS.length; i++) {
          const fields = STEP_FIELDS[i];
          if (!fields.length) continue;
          const stepOk = await trigger(fields);
          if (!stepOk) {
            const targetId = STEPS[i]?.id;
            const targetIndex = steps.findIndex((s) => s.id === targetId);
            if (targetIndex >= 0) setStep(targetIndex);
            break;
          }
        }
        return;
      }
      void handleSubmit(submit)();
      return;
    }

    const fieldIndex = STEPS.findIndex((s) => s.id === stepId);
    const fields = STEP_FIELDS[fieldIndex];
    if (fields.length > 0) {
      const ok = await trigger(fields);
      if (!ok) return;
    }
    onStepComplete?.(getValues(), stepId);
    setStep((s) => s + 1);
  };

  const stepId = steps[step]?.id;

  return (
    <form onSubmit={handleSubmit(submit)} className="min-w-0">
      <DarboiFormHeader contextLabel={contextLabel} />

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
          {stepId === "personal" && (
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
              <div className="sm:col-span-2">
                <label className={formLabelClass}>Full legal name *</label>
                <input {...register("fullLegalName")} className={formInputClass} placeholder="As on passport" />
                {errors.fullLegalName && <p className="mt-1 text-sm text-red-500">{errors.fullLegalName.message}</p>}
              </div>
              <div className="min-w-0 overflow-hidden">
                <label className={formLabelClass}>Date of birth *</label>
                <input {...register("dateOfBirth")} type="date" className={formInputClass} />
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <label className={formLabelClass}>Marital status *</label>
                <select {...register("maritalStatus")} className={formInputClass} defaultValue="">
                  <option value="" disabled>Choose</option>
                  {MARITAL_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {errors.maritalStatus && <p className="mt-1 text-sm text-red-500">{errors.maritalStatus.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <span className={formLabelClass}>Sex *</span>
                <div className="mt-2 flex flex-wrap gap-6">
                  {SEX_OPTIONS.map((o) => (
                    <label key={o.value} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-navy-800 dark:text-navy-200">
                      <input type="radio" value={o.value} {...register("sex")} className="h-4 w-4 text-gold-500 focus:ring-gold-500" />
                      {o.label}
                    </label>
                  ))}
                </div>
                {errors.sex && <p className="mt-1 text-sm text-red-500">{errors.sex.message}</p>}
              </div>
            </div>
          )}

          {stepId === "contact" && (
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
              <div className="sm:col-span-2">
                <label className={formLabelClass}>Home address *</label>
                <input {...register("homeAddress")} className={formInputClass} placeholder="Full residential address" />
                {errors.homeAddress && <p className="mt-1 text-sm text-red-500">{errors.homeAddress.message}</p>}
              </div>
              <div>
                <label className={formLabelClass}>Email address *</label>
                <input {...register("email")} type="email" className={formInputClass} placeholder="your@email.com" />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <label className={formLabelClass}>Phone number *</label>
                <input {...register("phone")} type="tel" className={formInputClass} placeholder="08038178843" />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
              </div>
            </div>
          )}

          {stepId === "travel" && (
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
              <div className="sm:col-span-2">
                <label className={formLabelClass}>Passport number *</label>
                <input {...register("passportNumber")} className={formInputClass} placeholder="Passport number" />
                {errors.passportNumber && <p className="mt-1 text-sm text-red-500">{errors.passportNumber.message}</p>}
              </div>
              <div>
                <label className={formLabelClass} htmlFor="countryOfChoice">Country of choice *</label>
                <CountrySelect
                  id="countryOfChoice"
                  registration={register("countryOfChoice")}
                  className={formInputClass}
                  placeholder="Select destination country"
                  error={errors.countryOfChoice?.message}
                />
              </div>
              <div>
                <label className={formLabelClass}>Preferred programme of study *</label>
                <input {...register("preferredProgramme")} className={formInputClass} placeholder="Your programme" />
                {errors.preferredProgramme && <p className="mt-1 text-sm text-red-500">{errors.preferredProgramme.message}</p>}
              </div>
            </div>
          )}

          {stepId === "documents" && (
            <div className="grid min-w-0 gap-6 sm:grid-cols-2">
              <div>
                <label className={formLabelClass}>Passport photograph *</label>
                <p className="mb-2 text-xs text-navy-500">Up to 5 files — PDF, document, or image. Max 10 MB each.</p>
                <DocumentUpload files={passportPhoto} onChange={setPassportPhoto} error={passportPhotoError} maxFiles={5} />
              </div>
              <div>
                <label className={formLabelClass}>International passport photo page *</label>
                <p className="mb-2 text-xs text-navy-500">Up to 5 files — PDF, document, or image. Max 10 MB each.</p>
                <DocumentUpload files={passportBioPage} onChange={setPassportBioPage} error={passportBioError} maxFiles={5} />
              </div>
            </div>
          )}

          {stepId === "payment" && paymentStepOpensModal && (
            <div className="space-y-4 text-center sm:text-left">
              <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-700 dark:text-gold-400">
                  Consultation fee
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-navy-900 dark:text-white">
                  {paymentFeeLabel ?? "See amount in next step"}
                </p>
              </div>
              <p className="text-sm text-navy-600 dark:text-navy-300">
                Tap <strong className="text-navy-900 dark:text-white">Make payment</strong> below to open bank transfer
                details. Copy the account, pay the fee, then confirm with <strong>I&apos;ve made payment</strong> to
                submit your application and open WhatsApp.
              </p>
            </div>
          )}

          {stepId === "payment" && !paymentStepOpensModal && showPaymentInfo && !deferPaymentToModal && (
            <div>
              <label className={formLabelClass}>Payment reference / depositor name</label>
              <p className="mb-2 text-xs text-navy-500">Enter your transfer reference after paying by bank transfer</p>
              <input
                {...register("paymentReference")}
                className={formInputClass}
                placeholder="Transfer reference or depositor name"
              />
            </div>
          )}

        </FormStepFlow>
      </div>
    </form>
  );
}
