"use client";

import { Button } from "@/components/ui/Button";
import { ScrollRevealFade } from "@/components/motion/ScrollRevealFade";

interface CTABannerProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTABanner({
  title = "Ready to Get Started?",
  description = "Submit your application online and get assistance via WhatsApp.",
  primaryLabel = "Browse Services",
  primaryHref = "/services",
  secondaryLabel = "Contact Us",
  secondaryHref = "/contact",
}: CTABannerProps) {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <ScrollRevealFade className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 px-8 py-16 text-center md:px-16">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80')] bg-cover bg-center opacity-20" />
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-navy-200">{description}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href={primaryHref} size="lg">
                {primaryLabel}
              </Button>
              <Button
                href={secondaryHref}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-navy-900"
              >
                {secondaryLabel}
              </Button>
            </div>
          </div>
        </ScrollRevealFade>
      </div>
    </section>
  );
}
