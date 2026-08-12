import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function GET() {
  const res = await backendAuthedFetch("customer", "/designs/custom");
  return forwardBackendJson(res);
}

export async function PUT(request: Request) {
  const body = await request.text();
  const res = await backendAuthedFetch("customer", "/designs/custom", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  });
  return forwardBackendJson(res);
}
