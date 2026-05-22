import { getServerSupabase } from "@/supabase/server";
import { sendContactForm } from "@/services/formsubmit";
import type { ContactFormData } from "@/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Save contact message to Supabase; optional server-side FormSubmit (client may send email too). */
export async function POST(request: Request) {
  try {
    const data = (await request.json()) as ContactFormData;
    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let emailSent = false;
    let emailError: string | undefined;

    try {
      await sendContactForm(data);
      emailSent = true;
    } catch (err) {
      emailError = err instanceof Error ? err.message : "Email failed";
      console.error("[api/contact] FormSubmit:", err);
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

    return NextResponse.json({
      ok: true,
      emailSent,
      emailError,
      saved: Boolean(supabase),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save message" },
      { status: 500 }
    );
  }
}
