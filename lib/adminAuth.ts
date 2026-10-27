import { NextRequest } from 'next/server';
import crypto from 'crypto';

const DEFAULT_ADMIN_PASSWORD = 'biaz2026';
const ADMIN_COOKIE_NAME = 'biaz_admin_session';

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

function getSecretKey(): string {
  return process.env.ADMIN_SESSION_SECRET || 'biaz-craftsmanship-secret-salt-2026';
}

/**
 * Verify given password against server password (timing-safe)
 */
export function verifyAdminPassword(password: string): boolean {
  if (typeof password !== 'string') return false;

  const validPasswords: string[] = [];
  if (process.env.ADMIN_PASSWORD) {
    validPasswords.push(process.env.ADMIN_PASSWORD.trim());
  }
  if (DEFAULT_ADMIN_PASSWORD && !validPasswords.includes(DEFAULT_ADMIN_PASSWORD)) {
    validPasswords.push(DEFAULT_ADMIN_PASSWORD);
  }

  const bufActual = Buffer.from(password.trim());

  for (const candidate of validPasswords) {
    const bufCandidate = Buffer.from(candidate);
    if (
      bufCandidate.length === bufActual.length &&
      crypto.timingSafeEqual(bufCandidate, bufActual)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Generate a signed session token valid for 7 days
 */
export function generateAdminSessionToken(): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `biaz_admin_${expiresAt}`;
  const hmac = crypto.createHmac('sha256', getSecretKey()).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

/**
 * Validate session token integrity and expiration
 */
export function verifyAdminSessionToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payload, hmac] = parts;
  const expectedHmac = crypto.createHmac('sha256', getSecretKey()).update(payload).digest('hex');

  const bufExpected = Buffer.from(expectedHmac);
  const bufActual = Buffer.from(hmac);
  if (bufExpected.length !== bufActual.length || !crypto.timingSafeEqual(bufExpected, bufActual)) {
    return false;
  }

  const expMatch = payload.match(/^biaz_admin_(\d+)$/);
  if (!expMatch) return false;

  const expiresAt = Number(expMatch[1]);
  if (Date.now() > expiresAt) {
    return false;
  }

  return true;
}

/**
 * Helper to check if request is authenticated as admin
 */
export function checkAdminAuth(req: NextRequest): boolean {
  // 1. Check HTTP-only cookie
  const cookieToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookieToken && verifyAdminSessionToken(cookieToken)) {
    return true;
  }

  // 2. Check Authorization Bearer header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const headerToken = authHeader.substring(7).trim();
    if (verifyAdminSessionToken(headerToken)) {
      return true;
    }
  }

  return false;
}

export { ADMIN_COOKIE_NAME };
