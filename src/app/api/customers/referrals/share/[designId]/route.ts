import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

type Ctx = { params: Promise<{ designId: string }> };

export async function POST(_request: Request, ctx: Ctx) {
  const { designId } = await ctx.params;
  const res = await backendAuthedFetch(
    "customer",
    `/referrals/me/share/${encodeURIComponent(designId)}`,
    { method: "POST" },
  );
  return forwardBackendJson(res);
}
