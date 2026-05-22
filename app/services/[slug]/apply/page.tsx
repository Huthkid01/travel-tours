"use client";

import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { PageHero } from "@/components/layout/PageHero";
import { submitApplicationWithNotify } from "@/lib/submit-application";
import type { ApplicationFormData } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { ServiceItem } from "@/types";

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [service, setService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    fetch(`/api/services/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setService)
      .catch(() => setService(null));
  }, [slug]);

  if (!service) {
    return (
      <div className="container-custom py-32 text-center">
        <p>Service not found.</p>
      </div>
    );
  }

  const handleSubmit = async (data: ApplicationFormData, files: File[]) => {
    try {
      const { application, emailSent } = await submitApplicationWithNotify(
        slug,
        service.title,
        data,
        files
      );

      sessionStorage.setItem("pending_application_id", application.id);
      if (emailSent) {
        toast.success("Application submitted! Darboi Consults has been notified by email.");
      } else {
        toast.success("Application saved. Proceed to payment.");
        toast.warning("Email notification could not be sent. Your application is still saved.");
      }
      router.push(`/services/${slug}/apply/payment?applicationId=${application.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit application");
    }
  };

  return (
    <>
      <PageHero title="Application Form" subtitle={`Apply for ${service.title}`} />
      <section className="section-padding bg-navy-50/50 dark:bg-navy-950/30">
        <div className="container-custom max-w-2xl">
          <ApplicationForm
            serviceSlug={slug}
            serviceTitle={service.title}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </>
  );
}
