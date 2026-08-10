import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const res = await backendAuthedFetch(
    "installer",
    `/payments/${encodeURIComponent(id)}/refresh`,
    { method: "POST" },
  );
  return forwardBackendJson(res);
}
