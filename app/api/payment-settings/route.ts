import { fetchPaymentSettings } from "@/services/cms";
import { NextResponse } from "next/server";

/** Public read — bank details & enabled payment methods for forms */
export async function GET() {
  try {
    const settings = await fetchPaymentSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Failed to load payment settings" },
      { status: 500 }
    );
  }
}
