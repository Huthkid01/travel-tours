"use server";

import { getSiteUrl, isSupabaseServerConfigured } from "@/lib/env.server";
import { getServerSupabase } from "@/supabase/server";
import { sendLeadForm } from "@/services/formsubmit";
import type { LeadPayload } from "@/services/leads";

export async function submitLeadAction(data: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    await sendLeadForm(data, { submissionUrl: getSiteUrl() });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to send notification email",
    };
  }

  if (!isSupabaseServerConfigured()) {
    return { ok: true };
  }

  const supabase = getServerSupabase();
  if (!supabase) return { ok: true };

  const { error } = await supabase.from("leads").insert({
    name: data.name,
    phone: data.phone,
    email: data.email,
    interest: data.interest,
  });

  if (error) {
    console.error("[submitLeadAction] Supabase insert failed:", error);
  }

  return { ok: true };
}
