import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function GET(req: Request) {
  const incoming = new URL(req.url).searchParams;
  const sp = new URLSearchParams();
  const limit = incoming.get("limit");
  if (limit) sp.set("limit", limit);
  const qs = sp.toString();

  const res = await backendAuthedFetch(
    "customer",
    `/payments/mine${qs ? `?${qs}` : ""}`,
  );
  return forwardBackendJson(res);
}
