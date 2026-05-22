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

export function getFormSubmitEmail(): string {
  return process.env.FORMSUBMIT_EMAIL?.trim() || "darboiconsults@gmail.com";
}

export function getGoogleFormShareUrl(): string | undefined {
  return process.env.GOOGLE_FORM_URL?.trim();
}

export function getSiteUrl(): string {
  if (process.env.SITE_URL?.trim()) return process.env.SITE_URL.trim();
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function getPaystackPublicKey(): string {
  return process.env.PAYSTACK_PUBLIC_KEY?.trim() || "pk_test_demo";
}

export function getFlutterwavePublicKey(): string {
  return process.env.FLUTTERWAVE_PUBLIC_KEY?.trim() || "FLWPUBK_TEST-demo";
}

export function isFormSubmitServerConfigured(): boolean {
  const email = getFormSubmitEmail();
  return Boolean(email && email.includes("@"));
}
