import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Server-only Supabase client (bypasses RLS) — use in admin API routes only */
export function getAdminSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
