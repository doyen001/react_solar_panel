import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  clearInstallerAuthCookies,
  INSTALLER_REFRESH_COOKIE,
  setInstallerSessionCookies,
} from "@/lib/auth/installer-cookies";
import { executeTokenRefresh } from "@/lib/auth/execute-token-refresh";
import { decodeJwtRole } from "@/lib/auth/middleware-session";
import { setAdminSessionCookies } from "@/lib/auth/admin-cookies";

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

  /**
   * Admin logins duplicate their JWT into the installer cookie slot (see
   * /api/admin/login) so master-portal pages can reuse installer-facing
   * proxies. That means an admin's session gets refreshed here too — if we
   * only rotated the installer cookie pair, the admin cookie pair (used by
   * admin-only endpoints via backendAuthedFetch("admin", ...)) would keep
   * the old, now-rotated-out refresh token and silently die later. Mirror
   * the refreshed tokens into the admin cookie pair whenever the token's
   * own role claim says ADMIN.
   */
  if (decodeJwtRole(outcome.accessToken) === "ADMIN") {
    setAdminSessionCookies(res, {
      accessToken: outcome.accessToken,
      refreshToken: outcome.refreshToken,
    });
  }

  return res;
}
