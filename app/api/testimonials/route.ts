import { jsonNoCache } from "@/lib/api-no-cache";
import { fetchTestimonials } from "@/services/cms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    return jsonNoCache(await fetchTestimonials());
  } catch {
    return jsonNoCache([], { status: 500 });
  }
}
