import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const qs = new URL(request.url).searchParams.toString();
  const path = `/conversations/${id}/messages${qs ? `?${qs}` : ""}`;
  const res = await backendAuthedFetch("customer", path);
  return forwardBackendJson(res);
}

export async function POST(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await request.text();
  const res = await backendAuthedFetch("customer", `/conversations/${id}/messages`, {
    method: "POST",
    body,
  });
  return forwardBackendJson(res);
}
