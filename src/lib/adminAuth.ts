import crypto from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 12; // stays logged in for 12 hours

function sign(payload: string): string {
  const secret = process.env.NEXTAUTH_SECRET ?? "";
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

// Creates a tamper-proof ticket saying "this browser is an admin"
export function createAdminToken(adminId: number): string {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${adminId}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

// Checks the ticket on the server
export function isAdminRequest(request: NextRequest): boolean {
  if (!process.env.NEXTAUTH_SECRET) return false;

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [adminId, expires, signature] = parts;
  const expected = sign(`${adminId}.${expires}`);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  return Number(expires) > Date.now();
}

export const adminCookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path:     "/",
  maxAge:   MAX_AGE_SECONDS,
};