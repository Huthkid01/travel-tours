import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG, isSupabaseConfigured } from "@/lib/constants";

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }
  return client;
}
