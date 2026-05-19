import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";
import { Award, Eye, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE_CONFIG.name} — our mission, vision, and commitment to exceptional travel experiences.`,
};

const highlights = [
  {
    title: "15+ Years of Excellence",
    description: "Over a decade crafting unforgettable journeys for thousands of travelers worldwide.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
  },
  {
    title: "50+ Global Destinations",
    description: "From desert dunes to alpine peaks, we cover the world's most sought-after locations.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02faf5dca4?w=600&q=80",
  },
  {
    title: "Award-Winning Service",
    description: "Recognized by industry leaders for outstanding customer satisfaction and innovation.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Darboi Consults Limited"
        subtitle="Your trusted partner in luxury travel since 2012"
        image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80"
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                label="Our Story"
                title="Company Overview"
                align="left"
                className="mb-6"
              />
              <p className="mb-4 leading-relaxed text-navy-600 dark:text-navy-300">
                {SITE_CONFIG.name} was founded with a simple belief: travel should be transformative,
                effortless, and deeply personal. What began as a boutique agency in New York has grown
                into a globally recognized brand serving discerning travelers across five continents.
              </p>
              <p className="leading-relaxed text-navy-600 dark:text-navy-300">
                We specialize in luxury tour packages, bespoke itineraries, and end-to-end travel
                management. Every journey we craft reflects our commitment to excellence, authenticity,
                and unforgettable experiences.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
                alt="Travel team"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50 dark:bg-navy-900/50">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 dark:bg-navy-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10">
                <Target className="h-6 w-6 text-gold-500" />
              </div>
              <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Our Mission</h3>
              <p className="mt-4 text-navy-600 dark:text-navy-400">
                To make world-class travel accessible and effortless for every client. We handle every
                detail — from booking to boarding — so you can focus on creating memories that last a lifetime.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 dark:bg-navy-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10">
                <Eye className="h-6 w-6 text-gold-500" />
              </div>
              <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Our Vision</h3>
              <p className="mt-4 text-navy-600 dark:text-navy-400">
                To be the world&apos;s most trusted luxury travel brand, known for innovation, integrity,
                and experiences that inspire wanderlust in every traveler we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            label="Why Us"
            title="Why Customers Choose Us"
            description="The Darboi Consults difference sets us apart"
          />
          <WhyChooseUs />
        </div>
      </section>

      <section className="section-padding bg-navy-950">
        <div className="container-custom">
          <SectionHeading
            label="Highlights"
            title="Travel Experience Highlights"
            description="Moments that define our commitment to excellence"
          />
          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="group overflow-hidden rounded-2xl bg-navy-900">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="400px"
                  />
                </div>
                <div className="p-6">
                  <Award className="mb-3 h-6 w-6 text-gold-500" />
                  <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-navy-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/tours" size="lg">
              Explore Our Tours
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
