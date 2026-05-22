import { ServicesPageClient } from "@/components/services/ServicesPageClient";
import { PageHero } from "@/components/layout/PageHero";
import { fetchServices } from "@/services/cms";

export default async function ServicesPage() {
  const services = await fetchServices();

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Professional documentation, certification, and travel consultation"
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80"
      />
      <section className="section-padding">
        <div className="container-custom">
          <ServicesPageClient services={services} />
        </div>
      </section>
    </>
  );
}
