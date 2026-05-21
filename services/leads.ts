import { getSupabaseClient } from "@/supabase/client";

export interface LeadPayload {
  name: string;
  phone: string;
  email: string;
  interest: string;
}

const DEMO_KEY = "daboi_leads";

export async function submitLead(data: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    try {
      const list = JSON.parse(sessionStorage.getItem(DEMO_KEY) || "[]") as unknown[];
      list.push({ ...data, created_at: new Date().toISOString() });
      sessionStorage.setItem(DEMO_KEY, JSON.stringify(list));
      return { ok: true };
    } catch {
      return { ok: false, error: "Storage failed" };
    }
  }

  const { error } = await supabase.from("leads").insert({
    name: data.name,
    phone: data.phone,
    email: data.email,
    interest: data.interest,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
