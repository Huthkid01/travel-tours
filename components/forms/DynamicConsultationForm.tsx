"use client";

import { CountrySelect } from "@/components/forms/CountrySelect";
import { FormStepFlow, type FormStepConfig } from "@/components/forms/FormStepFlow";
import { formInputClass } from "@/components/forms/form-step-styles";
import { DocumentUpload } from "@/components/upload/DocumentUpload";
import { WhatsAppCTA } from "@/components/layout/WhatsAppCTA";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { getConsultationWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import type { ConsultationFormSchema, FormFieldConfig } from "@/types";
import { FileUp, MessageSquare, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

function buildZodSchema(fields: FormFieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    if (f.type === "email") shape[f.name] = z.string().email();
    else if (f.required) shape[f.name] = z.string().min(1, `${f.label} is required`);
    else shape[f.name] = z.string().optional();
  }
  return z.object(shape);
}

function isFieldVisible(field: FormFieldConfig, values: Record<string, string>): boolean {
  if (!field.showWhen) return true;
  return values[field.showWhen.field] === field.showWhen.value;
}

interface DynamicConsultationFormProps {
  schema: ConsultationFormSchema;
  contextLabel: string;
  onSubmitSuccess?: (data: Record<string, string>) => void;
  redirectToPayment?: string;
}

export function DynamicConsultationForm({
  schema,
  contextLabel,
  onSubmitSuccess,
  redirectToPayment,
}: DynamicConsultationFormProps) {
  const router = useRouter();
  const track = useLeadTrackerContext();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const zodSchema = useMemo(() => buildZodSchema(schema.fields), [schema.fields]);
  type FormValues = z.infer<typeof zodSchema>;

  const { register, handleSubmit, trigger, control, getValues, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(zodSchema),
    defaultValues: {},
  });

  const watched = useWatch({ control }) as Record<string, string>;
  const visibleFields = schema.fields.filter((f) => isFieldVisible(f, watched ?? {}));

  const inputFields = visibleFields.filter((f) => f.type !== "textarea" && f.type !== "file");
  const textareaFields = visibleFields.filter((f) => f.type === "textarea");
  const hasUpload = schema.enableFileUpload;

  const steps = useMemo(() => {
    const list: FormStepConfig[] = [
      { id: "info", title: "Your information", description: "Basic details for your consultation", icon: User },
    ];
    if (textareaFields.length > 0) {
      list.push({
        id: "details",
        title: "Additional details",
        description: "Tell us more about your request",
        icon: MessageSquare,
      });
    }
    if (hasUpload) {
      list.push({ id: "documents", title: "Documents", description: "Upload supporting files", icon: FileUp });
    }
    list.push({
      id: "submit",
      title: "Submit",
      description: schema.enablePayment ? "Continue to payment" : "Send and open WhatsApp",
      icon: MessageSquare,
    });
    return list;
  }, [textareaFields.length, hasUpload, schema.enablePayment]);

  const lastStepIndex = steps.length - 1;
  const stepId = steps[step]?.id;

  const submit = async (data: FormValues) => {
    if (schema.enableFileUpload && files.length === 0) {
      toast.error("Please upload at least one document");
      const docIdx = steps.findIndex((s) => s.id === "documents");
      if (docIdx >= 0) setStep(docIdx);
      return;
    }

    setLoading(true);
    track({
      actionType: "form_submit",
      service: contextLabel,
      source: "consultation",
      metadata: { formId: schema.id },
    });

    try {
      const payload = { ...data, context: contextLabel };
      sessionStorage.setItem("consultation_draft", JSON.stringify(payload));
      onSubmitSuccess?.(data as Record<string, string>);

      if (redirectToPayment) {
        toast.success("Proceeding to payment...");
        router.push(redirectToPayment);
        return;
      }

      toast.success("Consultation submitted! Opening WhatsApp...");
      track({ actionType: "consultation_start", service: contextLabel });
      window.location.href = openWhatsApp(getConsultationWhatsAppMessage(contextLabel));
    } catch {
      toast.error("Something went wrong. Please try WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: FormFieldConfig) => {
    const err = errors[field.name as keyof FormValues];
    if (!isFieldVisible(field, watched ?? {})) return null;

    if (field.type === "textarea") {
      return (
        <div key={field.name}>
          <label className="mb-1 block text-sm font-medium">{field.label}{field.required && " *"}</label>
          <textarea {...register(field.name)} rows={4} className={formInputClass} placeholder={field.placeholder} />
          {err && <p className="mt-1 text-sm text-red-500">{String(err.message)}</p>}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.name}>
          <label className="mb-1 block text-sm font-medium">{field.label}{field.required && " *"}</label>
          <select {...register(field.name)} className={formInputClass}>
            <option value="">Select...</option>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {err && <p className="mt-1 text-sm text-red-500">{String(err.message)}</p>}
        </div>
      );
    }

    if (field.type === "country") {
      return (
        <div key={field.name}>
          <label className="mb-1 block text-sm font-medium" htmlFor={field.name}>
            {field.label}{field.required && " *"}
          </label>
          <CountrySelect
            id={field.name}
            registration={register(field.name)}
            className={formInputClass}
            placeholder={field.placeholder ?? "Select country"}
            error={err ? String(err.message) : undefined}
          />
        </div>
      );
    }

    return (
      <div key={field.name}>
        <label className="mb-1 block text-sm font-medium">{field.label}{field.required && " *"}</label>
        <input
          {...register(field.name)}
          type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
          className={formInputClass}
          placeholder={field.placeholder}
        />
        {err && <p className="mt-1 text-sm text-red-500">{String(err.message)}</p>}
      </div>
    );
  };

  const handleContinue = async () => {
    if (stepId === "info") {
      const names = inputFields.map((f) => f.name);
      if (names.length > 0) {
        const ok = await trigger(names as (keyof FormValues)[]);
        if (!ok) return;
      }
      setStep((s) => s + 1);
      return;
    }

    if (stepId === "details") {
      const names = textareaFields.map((f) => f.name);
      if (names.length > 0) {
        const ok = await trigger(names as (keyof FormValues)[]);
        if (!ok) return;
      }
      setStep((s) => s + 1);
      return;
    }

    if (stepId === "documents") {
      if (files.length === 0) {
        toast.error("Please upload at least one document");
        return;
      }
      setStep((s) => s + 1);
      return;
    }

    void handleSubmit(submit)();
  };

  const values = getValues();

  return (
    <form onSubmit={handleSubmit(submit)} className="min-w-0 space-y-4">
      {schema.description && (
        <p className="text-sm text-navy-600 dark:text-navy-300">{schema.description}</p>
      )}

      <FormStepFlow
        flowTitle="Consultation"
        flowSubtitle={contextLabel}
        steps={steps}
        currentStep={step}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onContinue={handleContinue}
        continueLabel={
          step === lastStepIndex
            ? schema.enablePayment
              ? "Continue to Payment"
              : "Submit & Contact via WhatsApp"
            : undefined
        }
        isLastStep={step === lastStepIndex}
        isSubmitting={loading}
        showBack={step > 0}
        footer={
          step === lastStepIndex ? (
            <div className="flex justify-center pt-2">
              <WhatsAppCTA
                message={getConsultationWhatsAppMessage(contextLabel)}
                variant="link"
                label="Prefer WhatsApp?"
                service={contextLabel}
              />
            </div>
          ) : undefined
        }
      >
        {stepId === "info" && (
          <div className="grid gap-4 sm:grid-cols-2">{inputFields.map(renderField)}</div>
        )}

        {stepId === "details" && (
          <div className="space-y-4">{textareaFields.map(renderField)}</div>
        )}

        {stepId === "documents" && hasUpload && (
          <div>
            <label className="mb-2 block text-sm font-medium">Upload documents *</label>
            <DocumentUpload files={files} onChange={setFiles} />
          </div>
        )}

        {stepId === "submit" && (
          <div className="space-y-3 rounded-xl border border-navy-100 bg-navy-50/50 p-4 text-sm dark:border-navy-700 dark:bg-navy-950/50">
            {Object.entries(values).map(([key, val]) => (
              <p key={key}>
                <span className="font-semibold capitalize text-navy-700 dark:text-navy-200">{key.replace(/_/g, " ")}:</span>{" "}
                {String(val || "—")}
              </p>
            ))}
            {hasUpload && (
              <p>
                <span className="font-semibold text-navy-700 dark:text-navy-200">Files:</span> {files.length} uploaded
              </p>
            )}
          </div>
        )}
      </FormStepFlow>
    </form>
  );
}
