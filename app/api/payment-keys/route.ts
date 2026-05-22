import { getFlutterwavePublicKey, getPaystackPublicKey } from "@/lib/env.server";
import { NextResponse } from "next/server";

/** Public payment gateway keys (safe to expose — required for checkout SDK) */
export async function GET() {
  return NextResponse.json({
    paystack: getPaystackPublicKey(),
    flutterwave: getFlutterwavePublicKey(),
  });
}
