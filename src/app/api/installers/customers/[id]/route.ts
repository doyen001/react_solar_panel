import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const res = await backendAuthedFetch("installer", `/customers/${id}`);
  return forwardBackendJson(res);
}

export async function PATCH(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await request.text();
  const res = await backendAuthedFetch("installer", `/customers/${id}`, {
    method: "PATCH",
    body,
  });
  return forwardBackendJson(res);
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const res = await backendAuthedFetch("installer", `/customers/${id}`, {
    method: "DELETE",
  });
  return forwardBackendJson(res);
}
