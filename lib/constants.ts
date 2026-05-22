export const CURRENCY = {
  code: "NGN",
  locale: "en-NG",
} as const;

export const BRAND = {
  name: "Darboi Consults Limited",
  short: "Darboi Consults",
  logoPrimary: "Darboi",
  logoAccent: "Consults Limited",
} as const;

/** Public contact details (shown on site — not secret) */
export const SITE_CONFIG = {
  name: BRAND.name,
  email: "darboiconsults@gmail.com",
  phone: "08038178843",
  phoneTel: "+2348038178843",
  whatsapp: "2348038178843",
  address: "Head Office, 24 Olowu Road, Ikeja, Lagos, Nigeria",
  addressLines: ["Head Office", "24 Olowu Road, Ikeja, Lagos, Nigeria"] as const,
  description:
    "Premium documentation, certification, and travel consultation services. Professional support from application to delivery.",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=24+Olowu+Road,+Ikeja,+Lagos,+Nigeria&hl=en&z=16&output=embed",
  url:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.SITE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/programs", label: "Programs" },
  { href: "/#consultation-form", label: "Google Form" },
  { href: "/consultation", label: "Consultation" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const SOCIAL_LINKS = {
  tiktok: "https://www.tiktok.com/@darboiconsults",
  tiktokHandle: "@darboiconsults",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  instagramHandle: "@darboiconsults",
} as const;

export type SocialPlatform = "tiktok";

export const WHATSAPP_BASE = "https://wa.me";

export const APPLICATION_WHATSAPP_MESSAGE =
  "Hello, I just submitted my application through your website. I would like assistance with the next steps.";

export function getWhatsAppUrl(message?: string) {
  const number = SITE_CONFIG.whatsapp.replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `${WHATSAPP_BASE}/${number}${text}`;
}

export const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ACCEPTED_FILE_EXTENSIONS = ".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx";

export const MAX_FILE_SIZE_MB = 10;
