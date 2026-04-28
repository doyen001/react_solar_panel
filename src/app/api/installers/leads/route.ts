import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function GET(request: Request) {
  const qs = new URL(request.url).searchParams.toString();
  const path = `/leads${qs ? `?${qs}` : ""}`;
  const res = await backendAuthedFetch("installer", path);
  return forwardBackendJson(res);
}

export async function POST(request: Request) {
  const body = await request.text();
  const res = await backendAuthedFetch("installer", "/leads", {
    method: "POST",
    body,
  });
  return forwardBackendJson(res);
}
