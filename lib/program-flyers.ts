/** Local flyer assets in /public/programs/flyers */
export const PROGRAM_FLYERS_DIR = "/programs/flyers";

const FLYER_EXTENSIONS = [".webp", ".png", ".jpg", ".jpeg"] as const;

/** Stock fallback when a flyer file is not uploaded yet */
export const PROGRAM_FLYER_FALLBACKS: Record<string, string> = {
  "katana-flex-program":
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
  "special-travel-packages":
    "https://images.unsplash.com/photo-1469854523086-cc02afe5c88d?auto=format&fit=crop&w=800&q=80",
  "holiday-offers":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  "visa-campaign":
    "https://images.unsplash.com/photo-1436491865339-9a109c8a40d8?auto=format&fit=crop&w=800&q=80",
  "consultation-announcement":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
};

export function getProgramFlyerPath(slug: string, ext: (typeof FLYER_EXTENSIONS)[number] = ".jpg"): string {
  return `${PROGRAM_FLYERS_DIR}/${slug}${ext}`;
}

/** URLs to try in order (webp → png → jpg → configured fallback) */
export function getProgramFlyerCandidates(slug: string, configuredImage?: string): string[] {
  const local = FLYER_EXTENSIONS.map((ext) => getProgramFlyerPath(slug, ext));
  const fallback = PROGRAM_FLYER_FALLBACKS[slug];
  const ordered = new Set<string>();

  if (configuredImage?.startsWith(PROGRAM_FLYERS_DIR)) {
    ordered.add(configuredImage);
  }
  local.forEach((url) => ordered.add(url));
  if (fallback) ordered.add(fallback);

  return [...ordered];
}

export function isProgramFlyerImage(image: string, imageType?: string): boolean {
  if (imageType === "flyer") return true;
  return image.startsWith(PROGRAM_FLYERS_DIR);
}

export function getProgramFlyerFallback(slug: string): string {
  return PROGRAM_FLYER_FALLBACKS[slug] ?? PROGRAM_FLYER_FALLBACKS["katana-flex-program"];
}
