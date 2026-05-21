"use client";

import { DocumentUpload } from "@/components/upload/DocumentUpload";
import { Button } from "@/components/ui/Button";
import { WhatsAppCTA } from "@/components/layout/WhatsAppCTA";
import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { getConsultationWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import type { ConsultationFormSchema, FormFieldConfig } from "@/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
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
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const zodSchema = useMemo(() => buildZodSchema(schema.fields), [schema.fields]);
  type FormValues = z.infer<typeof zodSchema>;

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(zodSchema),
    defaultValues: {},
  });

  const watched = useWatch({ control }) as Record<string, string>;
  const visibleFields = schema.fields.filter((f) => isFieldVisible(f, watched ?? {}));

  const inputClass = cn(
    "w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
  );

  const submit = async (data: FormValues) => {
    if (schema.enableFileUpload && files.length === 0) {
      toast.error("Please upload at least one document");
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
          <textarea {...register(field.name)} rows={4} className={inputClass} placeholder={field.placeholder} />
          {err && <p className="mt-1 text-sm text-red-500">{String(err.message)}</p>}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.name}>
          <label className="mb-1 block text-sm font-medium">{field.label}{field.required && " *"}</label>
          <select {...register(field.name)} className={inputClass}>
            <option value="">Select...</option>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {err && <p className="mt-1 text-sm text-red-500">{String(err.message)}</p>}
        </div>
      );
    }

    return (
      <div key={field.name}>
        <label className="mb-1 block text-sm font-medium">{field.label}{field.required && " *"}</label>
        <input
          {...register(field.name)}
          type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
          className={inputClass}
          placeholder={field.placeholder}
        />
        {err && <p className="mt-1 text-sm text-red-500">{String(err.message)}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {schema.description && (
        <p className="text-navy-600 dark:text-navy-300">{schema.description}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {visibleFields
          .filter((f) => f.type !== "textarea" && f.type !== "file")
          .map(renderField)}
      </div>

      {visibleFields.filter((f) => f.type === "textarea").map(renderField)}

      {schema.enableFileUpload && (
        <div>
          <label className="mb-2 block text-sm font-medium">Upload Documents</label>
          <DocumentUpload files={files} onChange={setFiles} />
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {schema.enablePayment ? "Continue to Payment" : "Submit & Contact via WhatsApp"}
        </Button>
        <WhatsAppCTA
          message={getConsultationWhatsAppMessage(contextLabel)}
          variant="link"
          label="Prefer WhatsApp?"
          service={contextLabel}
        />
      </div>
    </form>
  );
}
