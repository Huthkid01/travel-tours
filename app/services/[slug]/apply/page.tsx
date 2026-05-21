"use client";

import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { PageHero } from "@/components/layout/PageHero";
import { submitApplicationWithNotify } from "@/lib/submit-application";
import { getServiceBySlug } from "@/data/services";
import type { ApplicationFormData } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMemo } from "react";

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const service = useMemo(() => getServiceBySlug(slug), [slug]);

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
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-xl dark:border-navy-800 dark:bg-navy-900">
            <ApplicationForm
              serviceSlug={slug}
              serviceTitle={service.title}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </section>
    </>
  );
}
