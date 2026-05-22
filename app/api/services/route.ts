import { jsonNoCache } from "@/lib/api-no-cache";
import { fetchServices } from "@/services/cms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const services = await fetchServices();
    return jsonNoCache(services);
  } catch {
    return jsonNoCache([], { status: 500 });
  }
}
