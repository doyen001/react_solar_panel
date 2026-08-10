import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function GET(req: Request) {
  const incoming = new URL(req.url).searchParams;
  const sp = new URLSearchParams();
  const customerId = incoming.get("customerId");
  const limit = incoming.get("limit");
  if (customerId) sp.set("customerId", customerId);
  if (limit) sp.set("limit", limit);
  const qs = sp.toString();

  const res = await backendAuthedFetch(
    "installer",
    `/payments${qs ? `?${qs}` : ""}`,
  );
  return forwardBackendJson(res);
}
