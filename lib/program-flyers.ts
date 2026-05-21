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
export function getProgramFlyerCandidates(slug: string, configuredImage?: string): string[] {
  const ordered = new Set<string>();

  if (configuredImage?.startsWith(PROGRAM_FLYERS_DIR)) {
    ordered.add(configuredImage);
  }

  const mapped = PROGRAM_FLYER_FILES[slug];
  if (mapped) {
    ordered.add(`${PROGRAM_FLYERS_DIR}/${mapped}`);
  }

  FLYER_EXTENSIONS.forEach((ext) => ordered.add(`${PROGRAM_FLYERS_DIR}/${slug}${ext}`));

  return [...ordered];
}

export function isProgramFlyerImage(image: string, imageType?: string): boolean {
  if (imageType === "flyer") return true;
  return image.startsWith(PROGRAM_FLYERS_DIR);
}
