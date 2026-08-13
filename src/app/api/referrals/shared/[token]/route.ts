import { buildBackendUrl } from "@/lib/customers/backend";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ token: string }> };

/**
 * Public: a shared journey is opened by people with no account, so this route
 * carries no session and forwards straight through.
 */
export async function GET(_request: Request, ctx: Ctx) {
  const { token } = await ctx.params;
  const backendBaseUrl = process.env.BACKEND_API_BASE_URL;

  if (!backendBaseUrl) {
    return NextResponse.json(
      {
        message:
          "Server configuration is missing BACKEND_API_BASE_URL for referrals.",
      },
      { status: 500 },
    );
  }

  const res = await fetch(
    buildBackendUrl(
      backendBaseUrl,
      `/referrals/shared/${encodeURIComponent(token)}`,
    ),
    { cache: "no-store", headers: { Accept: "application/json" } },
  );

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
