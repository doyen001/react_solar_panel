import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function GET() {
  const res = await backendAuthedFetch(
    "installer",
    "/users/assignable-for-leads",
  );
  return forwardBackendJson(res);
}
