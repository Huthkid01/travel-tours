import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { faqs } from "@/data/faqs";
import { CTABanner } from "@/components/home/CTABanner";
import { Hero } from "@/components/home/Hero";
import { ProcessSection } from "@/components/home/ProcessSection";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { FeaturedProgramsSection } from "@/components/programs/FeaturedProgramsSection";
import { ServiceCard } from "@/components/services/ServiceCard";
import { GoogleFormEmbed } from "@/components/forms/GoogleFormEmbed";
import { VisaProofsGallery } from "@/components/proofs/VisaProofsGallery";
import { MediaShowcase } from "@/components/media/MediaShowcase";
import { FeaturedVideoSection } from "@/components/social/FeaturedVideoSection";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/data/services";
import { SITE_CONFIG } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const featured = services.filter((s) => s.featured).slice(0, 6);

  return (
    <>
      <Hero />

      <FeaturedProgramsSection />

      <section id="visa-proofs" className="section-padding bg-navy-950">
        <div className="container-custom">
          <SectionHeading
            label="Success Proofs"
            title="Visa Approval Samples"
            description="Real outcomes from our clients — personal details redacted for privacy."
            align="center"
            className="[&_h2]:text-white [&_p]:text-navy-300 [&_span]:text-gold-400"
          />
          <div className="mt-10 sm:mt-12">
            <VisaProofsGallery />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="container-custom">
          <SectionHeading
            label="About Us"
            title="Your Trusted Documentation Partner"
            description={`${SITE_CONFIG.name} delivers premium documentation, certification, and travel consultation from our Ikeja office.`}
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">
            <p className="text-lg leading-relaxed text-navy-600 dark:text-navy-300">
              We simplify complex paperwork — from marriage certificates and police clearance to proof of funds,
              flight reservations, and embassy appointments. Our automated portal ensures every application is stored
              securely and our team is notified instantly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/about" variant="outline">
                Learn More
              </Button>
              <Button href="/contact">Contact Us</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50 dark:bg-navy-900/30">
        <div className="container-custom">
          <SectionHeading
            label="Our Services"
            title="16+ Professional Services"
            description="Documentation, travel, legal, and certification support under one roof."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/services" variant="secondary">
              View All Services <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            label="How It Works"
            title="Simple 5-Step Process"
            description="From service selection to WhatsApp assistance — fully automated."
          />
          <div className="mt-12">
            <ProcessSection />
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-950">
        <div className="container-custom">
          <StatsSection />
        </div>
      </section>

      <FeaturedVideoSection />

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            label="Showcase"
            title="Our Work & Highlights"
            description="Travel highlights, documentation success, and social previews."
            align="center"
          />
          <div className="mt-12">
            <MediaShowcase />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="container-custom max-w-3xl">
          <GoogleFormEmbed title="Consultation Form" />
        </div>
      </section>

      <section className="section-padding bg-navy-50 dark:bg-navy-900/30">
        <div className="container-custom">
          <SectionHeading label="Testimonials" title="What Our Clients Say" />
          <div className="mt-12">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <SectionHeading label="FAQ" title="Frequently Asked Questions" align="center" />
          <div className="mt-10">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to Get Started?"
        description="Choose a service, submit your documents, and pay securely online."
        primaryLabel="Browse Services"
        primaryHref="/services"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
