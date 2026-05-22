import { getServerSupabase } from "@/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/env.server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    const body = (await request.json()) as { paymentReference?: string };
    const ref = body.paymentReference?.trim();
    if (!ref) return NextResponse.json({ error: "paymentReference required" }, { status: 400 });

    if (!isSupabaseServerConfigured()) {
      return NextResponse.json({ ok: true, demo: true });
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { error } = await supabase
      .from("applications")
      .update({ payment_reference: ref })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 500 }
    );
  }
}
