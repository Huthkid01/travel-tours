export const CURRENCY = {
  code: "NGN",
  locale: "en-NG",
} as const;

export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Voyage Elite Travel",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@voyageelite.com",
  phone: process.env.NEXT_PUBLIC_ADMIN_PHONE || "+1 (234) 567-8900",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890",
  address: "123 Luxury Avenue, Suite 500, New York, NY 10001",
  description:
    "Premium travel and tour agency offering curated luxury experiences worldwide. Explore destinations, book tours, and travel with confidence.",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/tours", label: "Tours" },
  { href: "/reservation", label: "Reservation" },
  { href: "/payment", label: "Payment" },
  { href: "/contact", label: "Contact" },
];

export const FORMSPREE = {
  reservation: process.env.NEXT_PUBLIC_FORMSPREE_RESERVATION_ID || "demo_reservation",
  contact: process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID || "demo_contact",
};

export const PAYMENT_KEYS = {
  flutterwave: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "FLWPUBK_TEST-demo",
  paystack: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_demo",
};

export const WHATSAPP_BASE = "https://wa.me";

export function getWhatsAppUrl(message?: string) {
  const number = SITE_CONFIG.whatsapp.replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `${WHATSAPP_BASE}/${number}${text}`;
}

export const RESERVATION_WHATSAPP_MESSAGE =
  "Hello, I just submitted a travel reservation through your website. I'd like to continue planning my trip.";
