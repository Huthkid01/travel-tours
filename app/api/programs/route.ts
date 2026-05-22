import { jsonNoCache } from "@/lib/api-no-cache";
import { fetchPrograms } from "@/services/cms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const programs = await fetchPrograms();
    return jsonNoCache(programs);
  } catch {
    return jsonNoCache([], { status: 500 });
  }
}
