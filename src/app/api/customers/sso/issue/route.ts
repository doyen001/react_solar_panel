import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

/**
 * One-time SSO code for the signed-in customer, used to hand their session to
 * another Easylink site (e.g. easylinkplus.com) after they land back here
 * from that site's "Get Free Quote" flow. See the customer auth page.
 */
export async function POST() {
  const res = await backendAuthedFetch("customer", "/auth/sso/issue", {
    method: "POST",
  });
  return forwardBackendJson(res);
}
