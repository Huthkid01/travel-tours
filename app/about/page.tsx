import { PageHero } from "@/components/layout/PageHero";
import { StatsSection } from "@/components/home/StatsSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { achievements, missionVision } from "@/data/about";
import { trustIndicators } from "@/data/stats";
import { SITE_CONFIG } from "@/lib/constants";
import { getLucideIcon } from "@/lib/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE_CONFIG.name} — mission, vision, and our commitment to professional documentation services.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Da Boi Consults Limited"
        subtitle="Professional documentation & travel consultation from Ikeja, Lagos"
        image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80"
      />

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <SectionHeading label="Who We Are" title="Company Profile" />
          <p className="mt-6 text-lg leading-relaxed text-navy-600 dark:text-navy-300">
            {SITE_CONFIG.name} is a premium consultancy based at {SITE_CONFIG.address}. We specialise in
            documentation, certification, legal publications, and travel support for individuals and businesses
            across Nigeria and abroad.
          </p>
        </div>
      </section>

      <section className="section-padding bg-navy-50 dark:bg-navy-900/30">
        <div className="container-custom grid gap-12 md:grid-cols-2">
          <div className="rounded-2xl border border-gold-500/20 bg-white p-8 dark:bg-navy-900">
            <h3 className="font-display text-xl font-bold text-gold-600">Our Mission</h3>
            <p className="mt-4 text-navy-600 dark:text-navy-300">{missionVision.mission}</p>
          </div>
          <div className="rounded-2xl border border-gold-500/20 bg-white p-8 dark:bg-navy-900">
            <h3 className="font-display text-xl font-bold text-gold-600">Our Vision</h3>
            <p className="mt-4 text-navy-600 dark:text-navy-300">{missionVision.vision}</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading label="Trust" title="Why Clients Trust Us" align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustIndicators.map((item) => {
              const Icon = getLucideIcon(item.icon);
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-navy-100 bg-white p-6 text-center dark:border-navy-800 dark:bg-navy-900"
                >
                  <Icon className="mx-auto h-10 w-10 text-gold-500" />
                  <p className="mt-4 font-semibold">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <StatsSection />

      <section className="section-padding bg-navy-50 dark:bg-navy-900/30">
        <div className="container-custom">
          <SectionHeading label="Milestones" title="Business Achievements" align="center" />
          <div className="mt-12 space-y-6">
            {achievements.map((a) => (
              <div
                key={a.year}
                className="flex flex-col gap-2 rounded-2xl border border-navy-100 bg-white p-6 sm:flex-row sm:items-center sm:gap-8 dark:border-navy-800 dark:bg-navy-900"
              >
                <span className="font-display text-2xl font-bold text-gold-600">{a.year}</span>
                <div>
                  <h4 className="font-semibold text-navy-900 dark:text-white">{a.title}</h4>
                  <p className="text-navy-600 dark:text-navy-400">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
