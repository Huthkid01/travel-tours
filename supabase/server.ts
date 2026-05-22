import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseServerConfigured } from "@/lib/env.server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Server-only Supabase client (anon key + RLS) */
export function getServerSupabase(): SupabaseClient | null {
  if (!isSupabaseServerConfigured()) return null;
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
