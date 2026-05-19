import dynamic from "next/dynamic";
import { HeroSlider } from "@/components/home/HeroSlider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { destinations } from "@/data/destinations";
import { getFeaturedTours } from "@/data/tours";
import { faqs } from "@/data/faqs";

const DestinationCard = dynamic(
  () => import("@/components/destinations/DestinationCard").then((m) => m.DestinationCard),
  { loading: () => <div className="skeleton aspect-[3/4] rounded-2xl" /> }
);

const TourCard = dynamic(
  () => import("@/components/tours/TourCard").then((m) => m.TourCard),
  { loading: () => <div className="skeleton aspect-[4/3] rounded-2xl" /> }
);

const WhyChooseUs = dynamic(
  () => import("@/components/home/WhyChooseUs").then((m) => m.WhyChooseUs)
);

const StatsSection = dynamic(
  () => import("@/components/home/StatsSection").then((m) => m.StatsSection)
);

const TestimonialCarousel = dynamic(
  () => import("@/components/home/TestimonialCarousel").then((m) => m.TestimonialCarousel)
);

const FAQAccordion = dynamic(
  () => import("@/components/faq/FAQAccordion").then((m) => m.FAQAccordion)
);

const CTABanner = dynamic(
  () => import("@/components/home/CTABanner").then((m) => m.CTABanner)
);

export default function HomePage() {
  const featuredTours = getFeaturedTours();

  return (
    <>
      <HeroSlider />

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="container-custom">
          <SectionHeading
            label="Destinations"
            title="Popular Destinations"
            description="Discover breathtaking locations handpicked by our travel experts"
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
            {destinations.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50 dark:bg-navy-900/50">
        <div className="container-custom">
          <SectionHeading
            label="Packages"
            title="Featured Tour Packages"
            description="Exclusive curated experiences for the discerning traveler"
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredTours.map((tour, i) => (
              <TourCard key={tour.id} tour={tour} index={i} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/tours" variant="outline" size="lg">
              View All Packages
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            label="Why Us"
            title="Why Choose Voyage Elite"
            description="We go above and beyond to make every journey extraordinary"
          />
          <WhyChooseUs />
        </div>
      </section>

      <section className="section-padding bg-navy-900">
        <div className="container-custom">
          <StatsSection />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            label="Testimonials"
            title="What Our Travelers Say"
            description="Real stories from real adventurers around the world"
          />
          <TestimonialCarousel />
        </div>
      </section>

      <section className="section-padding bg-navy-50 dark:bg-navy-900/50">
        <div className="container-custom max-w-3xl">
          <SectionHeading label="FAQ" title="Frequently Asked Questions" />
          <FAQAccordion items={faqs} />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <CTABanner />
        </div>
      </section>
    </>
  );
}
