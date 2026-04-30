import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function POST(request: Request) {
  const body = await request.text();
  const res = await backendAuthedFetch(
    "installer",
    "/communications/sms/follow-up",
    { method: "POST", body },
  );
  return forwardBackendJson(res);
}
