import { ConsultationPageContent } from "@/components/consultation/ConsultationPageContent";
import { fetchServices } from "@/services/cms";
import { Suspense } from "react";

export default async function ConsultationPage() {
  const services = await fetchServices();

  return (
    <Suspense fallback={<div className="container-custom py-32 text-center">Loading consultation...</div>}>
      <ConsultationPageContent services={services} />
    </Suspense>
  );
}
