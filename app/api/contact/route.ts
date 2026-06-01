import { getServerSupabase } from "@/supabase/server";
import type { ContactFormData } from "@/types";
import { NextResponse } from "next/server";

/** Save contact message — email is sent via Gmail (/api/owner-notify) */
export async function POST(request: Request) {
  try {
    const data = (await request.json()) as ContactFormData;
    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getServerSupabase();
    if (supabase) {
      await supabase.from("contact_submissions").insert({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() ?? "",
        subject: data.subject?.trim() ?? "",
        message: data.message.trim(),
      });
    }

    return NextResponse.json({ ok: true, saved: Boolean(supabase) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save message" },
      { status: 500 }
    );
  }
}
