import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { requestBackendRefreshTokens } from "@/lib/customers/refresh-backend";
import {
  ACCESS_COOKIE_MAX_AGE_SEC,
  clearInstallerAuthCookies,
  cookieBaseOptions,
  INSTALLER_ACCESS_COOKIE,
  INSTALLER_REFRESH_COOKIE,
  REFRESH_COOKIE_MAX_AGE_SEC,
} from "@/lib/auth/installer-cookies";

const refreshBodySchema = z.object({
  refreshToken: z.string().min(1),
});

export async function POST(request: Request) {
  const jar = await cookies();
  let refreshToken = jar.get(INSTALLER_REFRESH_COOKIE)?.value ?? null;

  if (!refreshToken) {
    try {
      const body = await request.json();
      const parsed = refreshBodySchema.safeParse(body);
      if (parsed.success) {
        refreshToken = parsed.data.refreshToken;
      }
    } catch {
      /* body optional */
    }
  }

  if (!refreshToken) {
    const res = NextResponse.json(
      { message: "No refresh token available." },
      { status: 401 },
    );
    clearInstallerAuthCookies(res);
    return res;
  }

  const backendBaseUrl = process.env.BACKEND_API_BASE_URL;

  if (!backendBaseUrl) {
    return NextResponse.json(
      {
        message:
          "Server configuration is missing BACKEND_API_BASE_URL for refresh.",
      },
      { status: 500 },
    );
  }

  const outcome = await requestBackendRefreshTokens(
    backendBaseUrl,
    refreshToken,
  );

  if (!outcome.ok) {
    const message = outcome.clearSession
      ? "Session expired. Please sign in again."
      : "Unable to reach the auth service.";
    const res = NextResponse.json(
      {
        message,
      },
      { status: outcome.status },
    );
    if (outcome.clearSession) {
      clearInstallerAuthCookies(res);
    }
    return res;
  }

  const base = cookieBaseOptions();
  const res = NextResponse.json({ message: "Session refreshed." }, { status: 200 });

  res.cookies.set(INSTALLER_ACCESS_COOKIE, outcome.data.accessToken, {
    ...base,
    maxAge: ACCESS_COOKIE_MAX_AGE_SEC,
  });
  res.cookies.set(INSTALLER_REFRESH_COOKIE, outcome.data.refreshToken, {
    ...base,
    maxAge: REFRESH_COOKIE_MAX_AGE_SEC,
  });

  return res;
}
