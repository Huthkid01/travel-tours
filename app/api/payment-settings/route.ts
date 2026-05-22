import { jsonNoCache } from "@/lib/api-no-cache";
import { fetchPaymentSettings } from "@/services/cms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Public read — bank details & enabled payment methods for forms */
export async function GET() {
  try {
    const settings = await fetchPaymentSettings();
    return jsonNoCache(settings);
  } catch {
    return jsonNoCache(
      { error: "Failed to load payment settings" },
      { status: 500 }
    );
  }
}
