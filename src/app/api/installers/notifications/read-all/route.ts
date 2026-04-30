import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function PATCH() {
  const res = await backendAuthedFetch("installer", "/notifications/read-all", {
    method: "PATCH",
  });
  return forwardBackendJson(res);
}
