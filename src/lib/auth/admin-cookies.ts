import type { NextResponse } from "next/server";
import {
  ACCESS_COOKIE_MAX_AGE_SEC,
  REFRESH_COOKIE_MAX_AGE_SEC,
  cookieBaseOptions,
} from "@/lib/auth/customer-cookies";

/** Cookie names for admin JWTs (kept separate from installer / customer / distributor tokens). */
export const ADMIN_ACCESS_COOKIE = "admin_access_token";
export const ADMIN_REFRESH_COOKIE = "admin_refresh_token";

export { ACCESS_COOKIE_MAX_AGE_SEC, REFRESH_COOKIE_MAX_AGE_SEC, cookieBaseOptions };

export function clearAdminAuthCookies(response: NextResponse) {
  const cleared = {
    httpOnly: true as const,
    secure: false,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
  response.cookies.set(ADMIN_ACCESS_COOKIE, "", cleared);
  response.cookies.set(ADMIN_REFRESH_COOKIE, "", cleared);
}

export function setAdminSessionCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
) {
  const base = cookieBaseOptions();
  response.cookies.set(ADMIN_ACCESS_COOKIE, tokens.accessToken, {
    ...base,
    maxAge: ACCESS_COOKIE_MAX_AGE_SEC,
  });
  response.cookies.set(ADMIN_REFRESH_COOKIE, tokens.refreshToken, {
    ...base,
    maxAge: REFRESH_COOKIE_MAX_AGE_SEC,
  });
}
