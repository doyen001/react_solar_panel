import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

type Ctx = { params: Promise<{ leadId: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  const { leadId } = await ctx.params;
  const body = await request.text();
  const res = await backendAuthedFetch(
    "installer",
    `/project-journey/leads/${encodeURIComponent(leadId)}/current-milestone`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body,
    },
  );
  return forwardBackendJson(res);
}
