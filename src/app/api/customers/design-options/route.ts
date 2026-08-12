import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function GET() {
  const res = await backendAuthedFetch("customer", "/designs/options");
  return forwardBackendJson(res);
}

export async function POST(request: Request) {
  const body = await request.text();
  const res = await backendAuthedFetch("customer", "/designs/options/select", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  return forwardBackendJson(res);
}
