/** ISO 3166-1 alpha-2 from edge/CDN headers (Vercel, Cloudflare). */
export function getVisitorCountryCode(hdrs: Headers): string | null {
  const raw =
    hdrs.get("x-vercel-ip-country")?.trim() ||
    hdrs.get("cf-ipcountry")?.trim() ||
    null;
  if (!raw || raw === "XX" || raw === "T1") return null;
  return raw.toUpperCase();
}

export function formatCountryLabel(code: string | null | undefined): string {
  if (!code) return "—";
  try {
    const name = new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase());
    return name ? `${name} (${code.toUpperCase()})` : code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}
