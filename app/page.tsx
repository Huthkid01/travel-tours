import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { faqs } from "@/data/faqs";
import { CTABanner } from "@/components/home/CTABanner";
import { Hero } from "@/components/home/Hero";
import { ProcessSection } from "@/components/home/ProcessSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturedTestimonialsSection } from "@/components/home/FeaturedTestimonialsSection";
import { FeaturedProgramsSection } from "@/components/programs/FeaturedProgramsSection";
import { FeaturedServicesGrid } from "@/components/services/FeaturedServicesGrid";
import { GoogleFormSection } from "@/components/forms/GoogleFormSection";
import { VisaProofsGallery } from "@/components/proofs/VisaProofsGallery";
import { HashScrollOnLoad } from "@/components/layout/HashScrollOnLoad";
import { FeaturedVideoSection } from "@/components/social/FeaturedVideoSection";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fetchServices } from "@/services/cms";
import { SITE_CONFIG } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const services = await fetchServices();

  return (
    <>
      <HashScrollOnLoad />
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
              securely. Once payment is made, you are directed to WhatsApp to continue.
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
          <FeaturedServicesGrid initialServices={services} />
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

      <section id="consultation-form" className="section-padding bg-navy-50 dark:bg-navy-900/40">
        <div className="container-custom max-w-3xl">
          <SectionHeading
            label="Apply"
            title="Consultation Form"
            description="Five steps ending with Make payment — bank transfer, then submit and WhatsApp."
            align="center"
          />
          <div className="mt-8">
            <GoogleFormSection title="Consultation Form" />
          </div>
        </div>
      </section>

      <FeaturedTestimonialsSection />

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
