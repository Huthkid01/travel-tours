"use server";

import { getServerSupabase } from "@/supabase/server";
import { sendContactForm } from "@/services/formsubmit";
import type { ContactFormData } from "@/types";

export async function submitContactAction(data: ContactFormData): Promise<{ ok: boolean; error?: string }> {
  try {
    await sendContactForm(data);

    const supabase = getServerSupabase();
    if (supabase) {
      await supabase.from("contact_submissions").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      });
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to send message" };
  }
}
