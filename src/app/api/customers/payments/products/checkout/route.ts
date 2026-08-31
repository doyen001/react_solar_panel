import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function POST(request: Request) {
  const body = await request.text();
  const res = await backendAuthedFetch("customer", "/payments/products/checkout", {
    method: "POST",
    body,
  });
  return forwardBackendJson(res);
}
