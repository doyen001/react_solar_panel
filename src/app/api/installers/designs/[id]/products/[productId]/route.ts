import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

type Ctx = { params: Promise<{ id: string; productId: string }> };

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id, productId } = await ctx.params;
  const res = await backendAuthedFetch(
    "installer",
    `/designs/${id}/products/${productId}`,
    { method: "DELETE" },
  );
  return forwardBackendJson(res);
}
