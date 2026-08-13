import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function POST(request: Request) {
  const body = await request.text();
  const res = await backendAuthedFetch("customer", "/referrals/me/invites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  return forwardBackendJson(res);
}
