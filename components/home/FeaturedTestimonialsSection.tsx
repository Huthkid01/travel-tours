import { LiveTestimonialCarousel } from "@/components/home/LiveTestimonialCarousel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fetchTestimonials } from "@/services/cms";

export async function FeaturedTestimonialsSection() {
  const testimonials = await fetchTestimonials();

  return (
    <section className="section-padding bg-navy-50 dark:bg-navy-900/30">
      <div className="container-custom">
        <SectionHeading label="Testimonials" title="What Our Clients Say" />
        <div className="mt-12">
          <LiveTestimonialCarousel initialTestimonials={testimonials} />
        </div>
      </div>
    </section>
  );
}
