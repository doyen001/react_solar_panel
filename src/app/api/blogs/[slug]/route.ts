import { buildBackendUrl } from "@/lib/customers/backend";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const backendBaseUrl = process.env.BACKEND_API_BASE_URL;
  if (!backendBaseUrl) {
    return NextResponse.json(
      { message: "Server configuration is missing BACKEND_API_BASE_URL for blogs." },
      { status: 500 },
    );
  }

  const { slug } = await ctx.params;
  const res = await fetch(buildBackendUrl(backendBaseUrl, `/blogs/${slug}`), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
