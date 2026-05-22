import { getVisitorCountryCode } from "@/lib/visitor-geo";
import { headers } from "next/headers";

export async function enrichVisitMetadata(
  metadata?: Record<string, string>
): Promise<Record<string, string> | undefined> {
  const hdrs = await headers();
  const country = getVisitorCountryCode(hdrs);
  if (country == null) return metadata;
  return { ...metadata, country };
}
