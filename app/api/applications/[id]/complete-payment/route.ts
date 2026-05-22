import { notifyOwnerOnPayment } from "@/lib/notify-owner";
import { fetchPaymentSettings } from "@/services/cms";
import {
  getApplicationServer,
  updateApplicationPaymentServer,
} from "@/services/applications.server";
import type { PaymentType } from "@/types";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    const body = (await request.json()) as {
      paymentReference?: string;
      amount?: number;
      paymentType?: PaymentType;
    };

    const existing = await getApplicationServer(id);
    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const settings = await fetchPaymentSettings();
    const amount = body.amount ?? settings.feeAmount;
    const reference =
      body.paymentReference?.trim() || `BANK-${Date.now().toString(36).toUpperCase()}`;

    const updated = await updateApplicationPaymentServer(id, {
      reference,
      status: "paid",
      type: body.paymentType ?? "booking-fee",
      amount,
      provider: "bank-transfer",
    });

    if (!updated) {
      return NextResponse.json({ error: "Could not update payment" }, { status: 500 });
    }

    let emailSent = false;
    try {
      emailSent = await notifyOwnerOnPayment(updated, amount);
    } catch (err) {
      console.error("[complete-payment] email failed:", err);
    }

    return NextResponse.json({ ok: true, application: updated, emailSent });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Payment recording failed" },
      { status: 500 }
    );
  }
}
