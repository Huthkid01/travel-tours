/** Server-only environment — never import from client components */

export function getSupabaseUrl(): string {
  return process.env.SUPABASE_URL?.trim() || "";
}

export function getSupabaseAnonKey(): string {
  return process.env.SUPABASE_ANON_KEY?.trim() || "";
}

export function isSupabaseServerConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

/** Inbox that receives form notifications */
export function getOwnerInboxEmail(): string {
  return (
    process.env.OWNER_INBOX_EMAIL?.trim() ||
    process.env.FORMSUBMIT_EMAIL?.trim() ||
    "darboiconsults@gmail.com"
  );
}

/** Gmail account that sends mail (must match GMAIL_APP_PASSWORD) */
export function getSmtpUser(): string {
  return process.env.SMTP_USER?.trim() || "";
}

/** @deprecated Use getOwnerInboxEmail */
export function getFormSubmitEmail(): string {
  return getOwnerInboxEmail();
}

export function getGoogleFormShareUrl(): string | undefined {
  return process.env.GOOGLE_FORM_URL?.trim();
}

export function getSiteUrl(): string {
  const site = process.env.SITE_URL?.trim();
  if (site) return site.replace(/\/$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    return production.startsWith("http") ? production.replace(/\/$/, "") : `https://${production}`;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;

  return "http://localhost:3000";
}

export function getPaystackPublicKey(): string {
  return process.env.PAYSTACK_PUBLIC_KEY?.trim() || "pk_test_demo";
}

export function getFlutterwavePublicKey(): string {
  return process.env.FLUTTERWAVE_PUBLIC_KEY?.trim() || "FLWPUBK_TEST-demo";
}

export function isOwnerEmailConfigured(): boolean {
  const pass = process.env.GMAIL_APP_PASSWORD?.trim().replace(/\s+/g, "");
  const user = getSmtpUser();
  return Boolean(pass && user.includes("@"));
}

/** @deprecated Use isOwnerEmailConfigured */
export function isFormSubmitServerConfigured(): boolean {
  return isOwnerEmailConfigured();
}
