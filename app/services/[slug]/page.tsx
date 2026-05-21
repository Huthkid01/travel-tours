import { AnnouncementSidebar } from "@/components/announcements/AnnouncementSidebar";
import { PageHero } from "@/components/layout/PageHero";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/Button";
import { PriceLabel, PricingBlock } from "@/components/ui/PriceLabel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SHOW_PRICING } from "@/lib/features";
import { getRelatedServices, getServiceBySlug, services } from "@/data/services";
import { buildPageMetadata } from "@/lib/seo";
import { CheckCircle, Clock } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return buildPageMetadata({
    title: service.title,
    description: service.shortDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = getRelatedServices(slug);

  return (
    <>
      <PageHero title={service.title} subtitle={service.shortDescription} />
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Description</h2>
              <p className="mt-4 leading-relaxed text-navy-600 dark:text-navy-300">{service.description}</p>

              <h3 className="mt-10 font-display text-xl font-bold text-navy-900 dark:text-white">Requirements</h3>
              <ul className="mt-4 space-y-2">
                {service.requirements.map((req) => (
                  <li key={req} className="flex items-start gap-2 text-navy-600 dark:text-navy-300">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-xl dark:border-navy-800 dark:bg-navy-900">
                <p className="flex items-center gap-2 text-sm text-navy-500">
                  <Clock className="h-4 w-4" />
                  {service.processingTime}
                </p>
                <h3 className="mt-6 font-display text-xl font-bold">Pricing</h3>
                {SHOW_PRICING ? (
                  <ul className="mt-4 space-y-3">
                    <li className="flex justify-between border-b border-navy-100 pb-2 dark:border-navy-800">
                      <span>Booking fee</span>
                      <PriceLabel amount={service.pricing.bookingFee} />
                    </li>
                    <li className="flex justify-between border-b border-navy-100 pb-2 dark:border-navy-800">
                      <span>Deposit</span>
                      <PriceLabel amount={service.pricing.deposit} />
                    </li>
                    <li className="flex justify-between">
                      <span>Full payment</span>
                      <PriceLabel amount={service.pricing.full} />
                    </li>
                  </ul>
                ) : (
                  <div className="mt-4 space-y-2">
                    <PriceLabel variant="consultation" className="text-base" />
                    <PriceLabel variant="contact" className="text-sm" />
                    <PricingBlock className="mt-4" />
                  </div>
                )}
                <Button href={`/services/${slug}/apply`} className="mt-8 w-full" size="lg">
                  Apply Now
                </Button>
                <Button href={`/consultation?service=${slug}`} variant="outline" className="mt-3 w-full" size="sm">
                  Request Consultation
                </Button>
              </div>
              <AnnouncementSidebar />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-padding bg-navy-50 dark:bg-navy-900/30">
          <div className="container-custom">
            <SectionHeading label="Related" title="Related Services" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s, i) => (
                <ServiceCard key={s.slug} service={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
