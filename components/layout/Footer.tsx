import { NAV_LINKS, SITE_CONFIG, getWhatsAppUrl } from "@/lib/constants";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="container-custom section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-2xl font-bold text-white">
              Voyage <span className="text-gold-500">Elite</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-navy-300">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 text-navy-300 transition-colors hover:bg-gold-500 hover:text-navy-950"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
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
            <h4 className="mb-4 font-semibold text-white">Popular Tours</h4>
            <ul className="space-y-2 text-sm text-navy-300">
              <li><Link href="/tour/dubai-luxury-tour" className="hover:text-gold-400">Dubai Luxury Tour</Link></li>
              <li><Link href="/tour/turkey-experience" className="hover:text-gold-400">Turkey Experience</Link></li>
              <li><Link href="/tour/europe-adventure" className="hover:text-gold-400">Europe Adventure</Link></li>
              <li><Link href="/tour/maldives-escape" className="hover:text-gold-400">Maldives Escape</Link></li>
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
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
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
