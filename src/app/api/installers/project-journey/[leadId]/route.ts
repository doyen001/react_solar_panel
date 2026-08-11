import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

type Ctx = { params: Promise<{ leadId: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { leadId } = await ctx.params;
  const res = await backendAuthedFetch(
    "installer",
    `/project-journey/leads/${encodeURIComponent(leadId)}`,
  );
  return forwardBackendJson(res);
}
