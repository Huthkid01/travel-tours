import { getServerSupabase } from "@/supabase/server";
import type { LeadPayload } from "@/services/leads";
import { NextResponse } from "next/server";

/** Save lead — email via Gmail (/api/owner-notify) */
export async function POST(request: Request) {
  try {
    const data = (await request.json()) as LeadPayload;
    const supabase = getServerSupabase();
    if (supabase) {
      await supabase.from("leads").insert({
        name: data.name,
        phone: data.phone,
        email: data.email,
        interest: data.interest,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save" },
      { status: 500 }
    );
  }
}
