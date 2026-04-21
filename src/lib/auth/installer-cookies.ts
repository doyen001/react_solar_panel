import type { NextResponse } from "next/server";

/** Cookie names for installer JWTs (separate from customer tokens). */
export const INSTALLER_ACCESS_COOKIE = "installer_access_token";
export const INSTALLER_REFRESH_COOKIE = "installer_refresh_token";

export {
  ACCESS_COOKIE_MAX_AGE_SEC,
  REFRESH_COOKIE_MAX_AGE_SEC,
  cookieBaseOptions,
} from "@/lib/auth/customer-cookies";

export function clearInstallerAuthCookies(response: NextResponse) {
  const cleared = {
    httpOnly: true as const,
    secure: false,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
  response.cookies.set(INSTALLER_ACCESS_COOKIE, "", cleared);
  response.cookies.set(INSTALLER_REFRESH_COOKIE, "", cleared);
}
