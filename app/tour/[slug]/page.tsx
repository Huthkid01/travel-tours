import { PageHero } from "@/components/layout/PageHero";
import { TourGallery } from "@/components/tours/TourGallery";
import { Button } from "@/components/ui/Button";
import { tours, getTourBySlug } from "@/data/tours";
import { formatPrice } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { Clock, MapPin, Star, Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface TourPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return { title: "Tour Not Found" };

  return {
    title: tour.title,
    description: tour.description,
    openGraph: {
      title: `${tour.title} | ${SITE_CONFIG.name}`,
      description: tour.description,
      images: [{ url: tour.image }],
    },
  };
}

export default async function TourDetailPage({ params }: TourPageProps) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) notFound();

  return (
    <>
      <PageHero title={tour.title} subtitle={tour.country} image={tour.image} />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TourGallery images={tour.gallery} title={tour.title} />

              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
                  About This Tour
                </h2>
                <p className="mt-4 leading-relaxed text-navy-600 dark:text-navy-300">
                  {tour.description}
                </p>
              </div>

              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
                  Highlights
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {tour.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-navy-600 dark:text-navy-300">
                      <Star className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
                  What&apos;s Included
                </h2>
                <ul className="mt-4 space-y-3">
                  {tour.included.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-navy-600 dark:text-navy-300">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-900">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-navy-500">Starting from</span>
                    <p className="text-3xl font-bold text-gold-600">
                      {formatPrice(tour.price, tour.currency)}
                    </p>
                  </div>
                  {tour.rating && (
                    <div className="flex items-center gap-1 rounded-full bg-gold-500/10 px-3 py-1">
                      <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
                      <span className="font-semibold">{tour.rating}</span>
                      <span className="text-xs text-navy-500">({tour.reviews})</span>
                    </div>
                  )}
                </div>

                <div className="mb-6 space-y-3 border-y border-navy-100 py-4 dark:border-navy-800">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-gold-500" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-gold-500" />
                    <span>{tour.country}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button href={`/reservation?destination=${encodeURIComponent(tour.title)}`} className="w-full">
                    Book This Tour
                  </Button>
                  <Button href="/payment" variant="outline" className="w-full">
                    Make Payment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
