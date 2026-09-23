import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/** Cookie that carries the signed admin session. */
export const ADMIN_COOKIE = "gso_admin";

/** How long a login stays valid. */
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** True once ADMIN_PASSWORD exists in the environment. */
export function isConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** Sessions are signed with the password itself, so changing the password
 *  invalidates every outstanding session. */
function sign(expiresAt: number): string {
  return createHmac("sha256", process.env.ADMIN_PASSWORD as string)
    .update(`gso-admin:${expiresAt}`)
    .digest("hex");
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  return `${expiresAt}.${sign(expiresAt)}`;
}

/** Verifies structure, expiry and signature in constant time. */
export function verifySessionToken(
  token: string | undefined | null,
): boolean {
  if (!token || !isConfigured()) return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;

  const expiresAt = Number(token.slice(0, dot));
  const signature = token.slice(dot + 1);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const expected = sign(expiresAt);
  if (signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

/** Constant-time password check (hashes first so lengths always match). */
export function checkPassword(input: string): boolean {
  const stored = process.env.ADMIN_PASSWORD;
  if (!stored) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(stored).digest();
  return timingSafeEqual(a, b);
}
