import { buildBackendUrl, unwrapApiData } from "@/lib/customers/backend";

const REFRESH_PATH = "/auth/refresh-token";

export type BackendRefreshResult = {
  accessToken: string;
  refreshToken: string;
};

export type BackendRefreshOutcome =
  | { ok: true; data: BackendRefreshResult }
  | { ok: false; clearSession: boolean; status: number };

/**
 * Calls backend `POST /auth/refresh-token`.
 * `clearSession` is true when the refresh token is invalid/expired (typically HTTP 401).
 */
export async function requestBackendRefreshTokens(
  backendBaseUrl: string,
  refreshToken: string,
): Promise<BackendRefreshOutcome> {
  let backendResponse: Response;
  try {
    backendResponse = await fetch(
      buildBackendUrl(backendBaseUrl, REFRESH_PATH),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      },
    );
  } catch {
    return { ok: false, clearSession: false, status: 502 };
  }

  const responseText = await backendResponse.text();
  let payload: unknown = null;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = null;
    }
  }

  if (!backendResponse.ok) {
    const clearSession = backendResponse.status === 401;
    return { ok: false, clearSession, status: backendResponse.status };
  }

  const data = unwrapApiData<BackendRefreshResult>(payload);
  if (
    !data ||
    typeof data.accessToken !== "string" ||
    typeof data.refreshToken !== "string"
  ) {
    return { ok: false, clearSession: false, status: 502 };
  }

  return { ok: true, data };
}
