import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE_CONFIG, getWhatsAppUrl } from "@/lib/constants";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE_CONFIG.name}. Send a message, call us, or chat on WhatsApp.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We're here to help plan your perfect journey"
        image="https://images.unsplash.com/photo-1423666639045-f560003c2af3?w=1920&q=80"
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                label="Get in Touch"
                title="We'd Love to Hear From You"
                align="left"
                className="mb-8"
              />

              <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-xl bg-navy-50 p-5 dark:bg-navy-900">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                  <div>
                    <p className="font-medium text-navy-900 dark:text-white">Address</p>
                    <p className="mt-1 text-sm text-navy-600 dark:text-navy-400">{SITE_CONFIG.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl bg-navy-50 p-5 dark:bg-navy-900">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                  <div>
                    <p className="font-medium text-navy-900 dark:text-white">Phone</p>
                    <a href={`tel:${SITE_CONFIG.phone}`} className="mt-1 text-sm text-gold-600 hover:underline">
                      {SITE_CONFIG.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl bg-navy-50 p-5 dark:bg-navy-900">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                  <div>
                    <p className="font-medium text-navy-900 dark:text-white">Email</p>
                    <a href={`mailto:${SITE_CONFIG.email}`} className="mt-1 text-sm text-gold-600 hover:underline">
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>

                <a
                  href={getWhatsAppUrl("Hello! I'd like to inquire about your travel services.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl bg-green-600 p-5 text-white transition-colors hover:bg-green-500"
                >
                  <MessageCircle className="h-6 w-6" />
                  <div>
                    <p className="font-medium">Chat on WhatsApp</p>
                    <p className="text-sm text-green-100">Available 24/7 for instant support</p>
                  </div>
                </a>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076684379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1635959222670!5m2!1sen!2sus"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale transition-all hover:grayscale-0"
                />
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
