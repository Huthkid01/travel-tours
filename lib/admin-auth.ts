import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "darboi_admin_session";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "darboi-change-this-secret-in-production";
}

export function getAdminCredentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!email || !password) return null;
  return { email, password };
}

export function verifyAdminLogin(email: string, password: string): boolean {
  const creds = getAdminCredentials();
  if (!creds) return false;
  const emailOk = email.trim().toLowerCase() === creds.email;
  const passOk = password === creds.password;
  return emailOk && passOk;
}

export function createAdminSessionToken(email: string): string {
  const expires = Date.now() + SESSION_MAX_AGE_MS;
  const payload = `${email}|${expires}`;
  const sig = createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}|${sig}`).toString("base64url");
}

export function verifyAdminSessionToken(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split("|");
    if (parts.length !== 3) return null;
    const [email, expiresStr, sig] = parts;
    const expires = Number(expiresStr);
    if (!email || !Number.isFinite(expires) || Date.now() > expires) return null;
    const payload = `${email}|${expires}`;
    const expected = createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const creds = getAdminCredentials();
    if (!creds || email.toLowerCase() !== creds.email) return null;
    return email;
  } catch {
    return null;
  }
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(getAdminCredentials() && getSessionSecret());
}
