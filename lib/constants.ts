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
    "Student study visas, tourist visit visas, and work permits — plus premium documentation and travel consultation from Lagos, Nigeria.",
  mapCenter: { lat: 6.6014, lng: 3.3515 },
  mapEmbedUrl:
    "https://maps.google.com/maps?q=24+Olowu+Road,+Ikeja,+Lagos,+Nigeria&hl=en&z=16&output=embed",
  mapOpenUrl:
    "https://www.google.com/maps/search/?api=1&query=24+Olowu+Road,+Ikeja,+Lagos,+Nigeria",
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
  { href: "/#consultation-form", label: "Apply" },
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

export const WHATSAPP_BASE = "https://api.whatsapp.com/send";

/** Nigeria local 080… → international 234… for WhatsApp */
export function formatWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 11) return `234${digits.slice(1)}`;
  if (digits.startsWith("234")) return digits;
  return digits;
}

/**
 * Official WhatsApp click-to-chat URL.
 * Uses api.whatsapp.com (not wa.me) so phones with both WhatsApp and
 * WhatsApp Business installed open Messenger reliably for visitors.
 */
export function getWhatsAppUrl(message?: string): string {
  const phone = formatWhatsAppPhone(SITE_CONFIG.whatsapp);
  const params = new URLSearchParams({ phone });
  if (message?.trim()) params.set("text", message.trim());
  return `${WHATSAPP_BASE}/?${params.toString()}`;
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

export const MAX_FILE_SIZE_MB = 4;
/** Vercel serverless request body limit is ~4.5 MB — keep uploads under this total */
export const MAX_UPLOAD_TOTAL_MB = 4;
