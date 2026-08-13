import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function GET() {
  const res = await backendAuthedFetch("customer", "/referrals/me");
  return forwardBackendJson(res);
}
