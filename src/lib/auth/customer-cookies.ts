import type { NextResponse } from "next/server";
import {
  ACCESS_COOKIE_MAX_AGE_SEC,
  REFRESH_COOKIE_MAX_AGE_SEC,
} from "@/lib/auth/jwt-cookie-max-age";

/** Cookie names for customer JWTs (set by Next.js API routes; httpOnly). */
export const CUSTOMER_ACCESS_COOKIE = "customer_access_token";
export const CUSTOMER_REFRESH_COOKIE = "customer_refresh_token";

export { ACCESS_COOKIE_MAX_AGE_SEC, REFRESH_COOKIE_MAX_AGE_SEC };

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

export function setCustomerSessionCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
) {
  const base = cookieBaseOptions();
  response.cookies.set(CUSTOMER_ACCESS_COOKIE, tokens.accessToken, {
    ...base,
    maxAge: ACCESS_COOKIE_MAX_AGE_SEC,
  });
  response.cookies.set(CUSTOMER_REFRESH_COOKIE, tokens.refreshToken, {
    ...base,
    maxAge: REFRESH_COOKIE_MAX_AGE_SEC,
  });
}
