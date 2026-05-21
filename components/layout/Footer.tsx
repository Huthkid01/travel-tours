import { BrandLogo } from "@/components/layout/BrandLogo";
import { SocialLinks } from "@/components/social/SocialLinks";
import { NAV_LINKS, SITE_CONFIG, getWhatsAppUrl } from "@/lib/constants";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="container-custom section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandLogo size="footer" className="mb-2" />
            <p className="mt-4 text-sm leading-relaxed text-navy-300">
              {SITE_CONFIG.description}
            </p>
            <SocialLinks variant="footer" className="mt-6" />
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-300 transition-colors hover:text-gold-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Popular Services</h4>
            <ul className="space-y-2 text-sm text-navy-300">
              <li><Link href="/services/proof-of-fund" className="hover:text-gold-400">Proof of Fund</Link></li>
              <li><Link href="/services/police-character-certificate" className="hover:text-gold-400">Police Character Certificate</Link></li>
              <li><Link href="/services/flight-reservation" className="hover:text-gold-400">Flight Reservation</Link></li>
              <li><Link href="/services/appointment-booking" className="hover:text-gold-400">Appointment Booking</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span className="text-navy-300">{SITE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold-500" />
                <a href={`tel:${SITE_CONFIG.phone}`} className="text-navy-300 hover:text-gold-400">
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold-500" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-navy-300 hover:text-gold-400">
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-navy-800 pt-8 text-center text-sm text-navy-400">
          <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
