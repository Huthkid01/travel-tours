export const CURRENCY = {
  code: "NGN",
  locale: "en-NG",
} as const;

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const BRAND = {
  name: "Darboi Consults Limited",
  short: "Darboi Consults",
  logoPrimary: "Darboi",
  logoAccent: "Consults Limited",
} as const;

export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || BRAND.name,
  url: getSiteUrl(),
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "darboilimited@gmail.com",
  phone: process.env.NEXT_PUBLIC_ADMIN_PHONE || "08038178843",
  /** E.164 for tel: links (same line as phone / WhatsApp) */
  phoneTel: "+2348038178843",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348038178843",
  address: "Head Office, 24 Olowu Road, Ikeja, Lagos, Nigeria",
  addressLines: ["Head Office", "24 Olowu Road, Ikeja, Lagos, Nigeria"] as const,
  description:
    "Premium documentation, certification, and travel consultation services. Professional support from application to delivery.",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=24+Olowu+Road,+Ikeja,+Lagos,+Nigeria&hl=en&z=16&output=embed",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/programs", label: "Programs" },
  { href: "/consultation", label: "Consultation" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const SOCIAL_LINKS = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com",
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "@daboi_consults",
  tiktokHandle: process.env.NEXT_PUBLIC_TIKTOK_HANDLE || "@daboi_consults",
} as const;

export type SocialPlatform = keyof Pick<typeof SOCIAL_LINKS, "instagram" | "tiktok" | "facebook">;

export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
};

export const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "demo_service",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "demo_template",
  contactTemplateId: process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || "demo_contact",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "demo_key",
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || SITE_CONFIG.email,
};

export const PAYMENT_KEYS = {
  flutterwave: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "FLWPUBK_TEST-demo",
  paystack: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_demo",
};

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

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
}

export function isEmailJsConfigured(): boolean {
  const { serviceId, templateId, publicKey } = EMAILJS_CONFIG;
  return !serviceId.includes("demo") && !templateId.includes("demo") && !publicKey.includes("demo");
}
