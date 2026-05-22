import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import { fetchAdminPaymentSettings, upsertAdminPaymentSettings } from "@/services/admin-data";
import type { PaymentSettings } from "@/data/payment-settings-default";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    return NextResponse.json(await fetchAdminPaymentSettings());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;
  try {
    const body = (await request.json()) as PaymentSettings;
    await upsertAdminPaymentSettings(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save" },
      { status: 500 }
    );
  }
}
