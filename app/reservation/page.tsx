import { PageHero } from "@/components/layout/PageHero";
import { ReservationFormWrapper } from "@/components/forms/ReservationFormWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LucideIcon, MessageCircle, Mail, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Make a Reservation",
  description: "Book your dream vacation. Submit your travel details and connect with our team instantly.",
};

const steps: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Mail,
    title: "Submit Your Details",
    description: "Fill out the form with your travel preferences and dates.",
  },
  {
    icon: Shield,
    title: "Email Confirmation",
    description: "We automatically send your reservation details to our team.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Follow-up",
    description: "Get redirected to WhatsApp to finalize your trip with our consultant.",
  },
];

export default function ReservationPage() {
  return (
    <>
      <PageHero
        title="Book Your Trip"
        subtitle="Complete the form below and we'll take care of everything"
        image="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80"
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-xl border border-navy-100 bg-white p-6 text-center dark:border-navy-800 dark:bg-navy-900"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10">
                    <Icon className="h-6 w-6 text-gold-500" />
                  </div>
                  <h3 className="font-semibold text-navy-900 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-navy-600 dark:text-navy-400">{step.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mx-auto max-w-4xl">
            <SectionHeading
              label="Reservation"
              title="Travel Reservation Form"
              description="All fields marked with * are required"
            />
            <ReservationFormWrapper />
          </div>
        </div>
      </section>
    </>
  );
}
