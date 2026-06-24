import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getActionSecret(): string {
  return (
    process.env.APPLICATION_ACTION_SECRET?.trim() ||
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    "darboi-change-this-secret-in-production"
  );
}

export function createApplicationActionToken(applicationId: string): string {
  const expires = Date.now() + TOKEN_MAX_AGE_MS;
  const payload = `${applicationId}|${expires}`;
  const sig = createHmac("sha256", getActionSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}|${sig}`).toString("base64url");
}

export function verifyApplicationActionToken(
  token: string | undefined,
  applicationId: string
): boolean {
  if (!token?.trim()) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split("|");
    if (parts.length !== 3) return false;
    const [id, expiresStr, sig] = parts;
    if (id !== applicationId) return false;
    const expires = Number(expiresStr);
    if (!Number.isFinite(expires) || Date.now() > expires) return false;
    const payload = `${id}|${expires}`;
    const expected = createHmac("sha256", getActionSecret()).update(payload).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    return true;
  } catch {
    return false;
  }
}
