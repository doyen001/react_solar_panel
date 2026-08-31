import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function GET(req: Request) {
  const incoming = new URL(req.url).searchParams;
  const sp = new URLSearchParams();
  const status = incoming.get("status");
  const kind = incoming.get("kind");
  const installerId = incoming.get("installerId");
  const limit = incoming.get("limit");
  if (status) sp.set("status", status);
  if (kind) sp.set("kind", kind);
  if (installerId) sp.set("installerId", installerId);
  if (limit) sp.set("limit", limit);
  const qs = sp.toString();

  const res = await backendAuthedFetch(
    "admin",
    `/payments/master${qs ? `?${qs}` : ""}`,
  );
  return forwardBackendJson(res);
}
