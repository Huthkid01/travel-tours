"use server";

import { getServerSupabase } from "@/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/env.server";
import type { LeadPayload } from "@/services/leads";

export async function submitLeadAction(data: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseServerConfigured()) {
    return { ok: true };
  }

  const supabase = getServerSupabase();
  if (!supabase) return { ok: false, error: "Database not configured" };

  const { error } = await supabase.from("leads").insert({
    name: data.name,
    phone: data.phone,
    email: data.email,
    interest: data.interest,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
