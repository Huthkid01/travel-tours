/** Google Form share or embed URL from env */
const raw = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL?.trim() ?? "";

/** URL suitable for iframe embed (?embedded=true) */
export function getGoogleFormEmbedUrl(): string | undefined {
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    if (!url.hostname.includes("docs.google.com")) return raw;
    if (!url.searchParams.has("embedded")) {
      url.searchParams.set("embedded", "true");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

export const hasGoogleForm = Boolean(getGoogleFormEmbedUrl());
