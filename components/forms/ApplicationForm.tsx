"use client";

import { useLeadTrackerContext } from "@/components/providers/LeadTrackerProvider";
import { DocumentUpload } from "@/components/upload/DocumentUpload";
import { Button } from "@/components/ui/Button";
import { applicationSchema, type ApplicationFormValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ApplicationFormProps {
  serviceTitle: string;
  onSubmit: (data: ApplicationFormValues, files: File[]) => Promise<void>;
}

export function ApplicationForm({ serviceTitle, onSubmit }: ApplicationFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const track = useLeadTrackerContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
  });

  const submit = async (data: ApplicationFormValues) => {
    if (files.length === 0) {
      setFileError("Please upload at least one document");
      return;
    }
    setFileError(undefined);
    setLoading(true);
    track({ actionType: "form_submit", service: serviceTitle, source: "application_form" });
    try {
      await onSubmit(data, files);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = cn(
    "w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
  );

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <p className="text-sm text-navy-600 dark:text-navy-300">
        Applying for: <strong className="text-gold-600">{serviceTitle}</strong>
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Full Name *</label>
          <input {...register("fullName")} className={inputClass} placeholder="John Doe" />
          {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email *</label>
          <input {...register("email")} type="email" className={inputClass} placeholder="you@email.com" />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Phone Number *</label>
          <input {...register("phone")} className={inputClass} placeholder="+234 800 000 0000" />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Country *</label>
          <input {...register("country")} className={inputClass} placeholder="Nigeria" />
          {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Address *</label>
        <input {...register("address")} className={inputClass} placeholder="Full residential address" />
        {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Purpose *</label>
        <input {...register("purpose")} className={inputClass} placeholder="e.g. Visa application, employment" />
        {errors.purpose && <p className="mt-1 text-sm text-red-500">{errors.purpose.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Additional Notes</label>
        <textarea
          {...register("notes")}
          rows={3}
          className={inputClass}
          placeholder="Any extra information for our team..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Upload Documents *</label>
        <DocumentUpload files={files} onChange={setFiles} error={fileError} />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Continue to Payment"
        )}
      </Button>
    </form>
  );
}
