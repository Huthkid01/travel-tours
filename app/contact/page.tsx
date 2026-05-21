import { ContactForm } from "@/components/forms/ContactForm";
import { GoogleFormEmbed } from "@/components/forms/GoogleFormEmbed";
import { MapEmbed } from "@/components/layout/MapEmbed";
import { SocialLinks } from "@/components/social/SocialLinks";
import { SocialGallery } from "@/components/social/SocialGallery";
import { socialPostPreviews } from "@/data/social-posts";
import { PageHero } from "@/components/layout/PageHero";
import { SITE_CONFIG, getWhatsAppUrl } from "@/lib/constants";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${SITE_CONFIG.name} — ${SITE_CONFIG.address}`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact Us" subtitle="We're here to help with your documentation needs" />
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Get in Touch</h2>
              <ul className="mt-8 space-y-6">
                <li className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 text-gold-500" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="whitespace-pre-line text-navy-600 dark:text-navy-300">
                      {SITE_CONFIG.addressLines.join("\n")}
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-gold-500" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href={`tel:${SITE_CONFIG.phoneTel}`} className="text-gold-600 hover:underline">
                      {SITE_CONFIG.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-gold-500" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${SITE_CONFIG.email}`} className="text-gold-600 hover:underline">
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </li>
              </ul>
              <SocialLinks variant="footer" className="mt-6" />
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-500"
              >
                Chat on WhatsApp
              </a>
              <div className="mt-10">
                <MapEmbed />
              </div>
            </div>
            <ContactForm />
          </div>
          <div className="mt-16">
            <GoogleFormEmbed />
          </div>
          <div className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-bold">Follow Our Journey</h2>
            <SocialGallery postPreview={socialPostPreviews} />
          </div>
        </div>
      </section>
    </>
  );
}
