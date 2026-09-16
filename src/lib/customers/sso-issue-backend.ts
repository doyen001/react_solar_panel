import { buildBackendUrl, unwrapApiData } from "@/lib/customers/backend";

const SSO_ISSUE_PATH = "/auth/sso/issue";

/**
 * Calls backend `POST /auth/sso/issue` directly with a bearer access token —
 * for use from the proxy (edge middleware), which already has the token from
 * the request cookie and redirects before any page/BFF route ever runs. See
 * `handleCustomerAuthPage` in proxy.ts.
 */
export async function requestBackendSsoCode(
  backendBaseUrl: string,
  accessToken: string,
): Promise<string | null> {
  let backendResponse: Response;
  try {
    backendResponse = await fetch(buildBackendUrl(backendBaseUrl, SSO_ISSUE_PATH), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch {
    return null;
  }

  if (!backendResponse.ok) return null;

  const responseText = await backendResponse.text();
  let payload: unknown = null;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = null;
    }
  }

  const data = unwrapApiData<{ code: string }>(payload);
  return typeof data?.code === "string" ? data.code : null;
}
