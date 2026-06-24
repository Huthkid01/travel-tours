import { PROGRAM_PHOTO_FALLBACKS } from "@/lib/program-photo-fallbacks";
import { images } from "@/lib/images";

/** Local flyer assets in /public/programs/flyers */
export const PROGRAM_FLYERS_DIR = "/programs/flyers";

const FLYER_EXTENSIONS = [".webp", ".png", ".jpg", ".jpeg"] as const;

/** Explicit flyer filename per program slug (handles custom client file names) */
export const PROGRAM_FLYER_FILES: Record<string, string> = {
  "serbia-warehouse-jobs": "serbia-warehouse-jobs.png",
  "serbia-visa": "serbia-visa.png",
  "student-visa": "student-visa.png",
  "france-tourist-visa": "france-tourist-visa.png",
  "turkey-tourist-visa": "turkey-tourist-visa.png",
  "italy-visa": "italy-visa.png",
  "mexico-world-cup-2026": "mexico-world-cup-2026.png",
  "kosovo-tourist-visa": "kosovo-tourist-visa.png",
  "turkey-visa-ambassador": "turkey-visa-ambassador.png",
  "schengen-work-visa": "schengen-work-visa.png",
  "japan-teaching-visa": "japan-teaching-visa.png",
};

export function getProgramFlyerPath(slug: string): string {
  const file = PROGRAM_FLYER_FILES[slug];
  if (file) return `${PROGRAM_FLYERS_DIR}/${file}`;
  return `${PROGRAM_FLYERS_DIR}/${slug}.png`;
}

/** URLs to try in order */
export function getProgramFlyerCandidates(
  slug: string,
  configuredImage?: string,
  imageType?: string
): string[] {
  const ordered = new Set<string>();

  if (configuredImage?.startsWith("http")) {
    ordered.add(configuredImage);
    return [...ordered];
  }

  if (configuredImage?.startsWith(PROGRAM_FLYERS_DIR)) {
    ordered.add(configuredImage);
  }

  const mapped = PROGRAM_FLYER_FILES[slug];
  if (mapped) {
    ordered.add(`${PROGRAM_FLYERS_DIR}/${mapped}`);
  }

  if (imageType !== "photo") {
    FLYER_EXTENSIONS.forEach((ext) => ordered.add(`${PROGRAM_FLYERS_DIR}/${slug}${ext}`));
  }

  /** Seed photo URLs when DB stored a missing flyer path */
  const photoFallback = PROGRAM_PHOTO_FALLBACKS[slug];
  if (photoFallback) {
    ordered.add(photoFallback);
  }

  if (ordered.size === 0) {
    ordered.add(images.travel);
  }

  return [...ordered];
}

export function isProgramFlyerImage(image: string, imageType?: string): boolean {
  if (imageType === "photo") return false;
  if (imageType === "flyer") return true;
  return image.startsWith(PROGRAM_FLYERS_DIR);
}
