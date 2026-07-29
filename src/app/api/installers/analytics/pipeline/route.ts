import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function GET() {
  const res = await backendAuthedFetch("installer", "/analytics/installer/pipeline");
  return forwardBackendJson(res);
}
