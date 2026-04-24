import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  clearInstallerAuthCookies,
  INSTALLER_REFRESH_COOKIE,
  setInstallerSessionCookies,
} from "@/lib/auth/installer-cookies";
import { executeTokenRefresh } from "@/lib/auth/execute-token-refresh";

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

  const outcome = await executeTokenRefresh(refreshToken);

  if (!outcome.ok) {
    const missingConfig =
      outcome.status === 500 && !process.env.BACKEND_API_BASE_URL;
    const message = missingConfig
      ? "Server configuration is missing BACKEND_API_BASE_URL for refresh."
      : outcome.clearSession
        ? "Session expired. Please sign in again."
        : "Unable to reach the auth service.";
    const res = NextResponse.json({ message }, { status: outcome.status });
    if (outcome.clearSession) {
      clearInstallerAuthCookies(res);
    }
    return res;
  }

  const res = NextResponse.json({ message: "Session refreshed." }, { status: 200 });
  setInstallerSessionCookies(res, {
    accessToken: outcome.accessToken,
    refreshToken: outcome.refreshToken,
  });

  return res;
}
