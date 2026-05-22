import { PROGRAM_FLYERS_DIR } from "@/lib/program-flyers";

/** Resolve image src for admin previews and tables */
export function resolveProgramImageSrc(image?: string | null): string | null {
  if (!image?.trim()) return null;
  const v = image.trim();
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (v.startsWith("/")) return v;
  return `${PROGRAM_FLYERS_DIR}/${v}`;
}

export function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
