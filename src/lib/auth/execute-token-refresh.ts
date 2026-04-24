import { requestBackendRefreshTokens } from "@/lib/customers/refresh-backend";

/**
 * Shared backend refresh for customer + installer (same BFF → `POST /auth/refresh-token`).
 * Use this from Route Handlers and from middleware — do not `fetch` the Next API from middleware
 * (loopback to ::1 / port can fail on Windows and is unnecessary).
 */
export type TokenRefreshResult =
  | { ok: true; accessToken: string; refreshToken: string }
  | { ok: false; clearSession: boolean; status: number };

export async function executeTokenRefresh(
  refreshToken: string,
): Promise<TokenRefreshResult> {
  const backendBaseUrl = process.env.BACKEND_API_BASE_URL;
  if (!backendBaseUrl) {
    return { ok: false, clearSession: false, status: 500 };
  }

  const outcome = await requestBackendRefreshTokens(
    backendBaseUrl,
    refreshToken,
  );

  if (!outcome.ok) {
    return {
      ok: false,
      clearSession: outcome.clearSession,
      status: outcome.status,
    };
  }

  return {
    ok: true,
    accessToken: outcome.data.accessToken,
    refreshToken: outcome.data.refreshToken,
  };
}
