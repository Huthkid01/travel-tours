import { getGoogleFormShareUrl } from "@/lib/env.server";

/** Resolved embed URL for https://forms.gle/CgsEKQ8JudSTRaVY9 */
export const GOOGLE_FORM_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfG3s8g_bMYl-p0vV4rP_S8ElTgTLNhHznL2EmuTL_0NFtlNw/viewform?embedded=true";

export const GOOGLE_FORM_SHARE_URL = "https://forms.gle/CgsEKQ8JudSTRaVY9";

const GLE_REDIRECTS: Record<string, string> = {
  [GOOGLE_FORM_SHARE_URL]: GOOGLE_FORM_EMBED_URL,
};

/** URL suitable for iframe embed — server components only */
export function getGoogleFormEmbedUrl(): string {
  const raw = getGoogleFormShareUrl() || GOOGLE_FORM_EMBED_URL;

  if (GLE_REDIRECTS[raw]) return GLE_REDIRECTS[raw];

  try {
    const url = new URL(raw);
    if (url.hostname === "forms.gle") {
      return GLE_REDIRECTS[raw] ?? GOOGLE_FORM_EMBED_URL;
    }
    if (url.hostname.includes("docs.google.com") && url.pathname.includes("/forms/")) {
      if (!url.searchParams.has("embedded")) {
        url.searchParams.set("embedded", "true");
      }
      url.searchParams.delete("usp");
      return url.toString();
    }
    return raw;
  } catch {
    return GOOGLE_FORM_EMBED_URL;
  }
}

export const hasGoogleForm = true;
