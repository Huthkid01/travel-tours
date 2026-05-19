import { PageHero } from "@/components/layout/PageHero";
import { TourCard } from "@/components/tours/TourCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { tours } from "@/data/tours";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tour Packages",
  description: "Browse our curated luxury tour packages to Dubai, Turkey, UK, Canada, Europe, and more.",
};

export default function ToursPage() {
  return (
    <>
      <PageHero
        title="Tour Packages"
        subtitle="Handcrafted journeys to the world's most extraordinary destinations"
        image="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80"
      />

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            label="Explore"
            title="All Tour Packages"
            description="Select your dream destination and let us handle the rest"
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour, i) => (
              <TourCard key={tour.id} tour={tour} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
