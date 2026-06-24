/** Edge-safe admin session verification for middleware (Web Crypto). */

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "darboi-change-this-secret-in-production";
}

function base64UrlDecode(value: string): string {
  const pad = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return atob(base64);
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function verifyAdminSessionTokenEdge(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  try {
    const decoded = base64UrlDecode(token);
    const parts = decoded.split("|");
    if (parts.length !== 3) return false;
    const [email, expiresStr, sig] = parts;
    const expires = Number(expiresStr);
    if (!email || !Number.isFinite(expires) || Date.now() > expires) return false;
    const payload = `${email}|${expires}`;
    const expected = await hmacSha256Hex(getSessionSecret(), payload);
    return timingSafeEqualHex(sig, expected);
  } catch {
    return false;
  }
}
