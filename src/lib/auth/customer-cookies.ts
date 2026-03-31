import type { NextResponse } from "next/server";

/** Cookie names for customer JWTs (set by Next.js API routes; httpOnly). */
export const CUSTOMER_ACCESS_COOKIE = "customer_access_token";
export const CUSTOMER_REFRESH_COOKIE = "customer_refresh_token";

/** Defaults aligned with backend `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN`. */
export const ACCESS_COOKIE_MAX_AGE_SEC = 15 * 60;
export const REFRESH_COOKIE_MAX_AGE_SEC = 7 * 24 * 60 * 60;

export function cookieBaseOptions() {
  return {
    httpOnly: true as const,
    // secure: process.env.NODE_ENV === "production",
    secure: false,
    sameSite: "lax" as const,
    path: "/",
  };
}

/** Clear both customer tokens (logout / invalid refresh). */
export function clearCustomerAuthCookies(response: NextResponse) {
  const cleared = {
    httpOnly: true as const,
    // secure: process.env.NODE_ENV === "production",
    secure: false,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
  response.cookies.set(CUSTOMER_ACCESS_COOKIE, "", cleared);
  response.cookies.set(CUSTOMER_REFRESH_COOKIE, "", cleared);
}
