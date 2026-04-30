import { buildBackendUrl } from "@/lib/customers/backend";
import { NextResponse } from "next/server";

/**
 * Public proxy — no cookies / no bearer token. Backend route: GET /leads/marketplace
 */
export async function GET(request: Request) {
  const backendBaseUrl = process.env.BACKEND_API_BASE_URL;
  if (!backendBaseUrl) {
    return NextResponse.json(
      {
        message:
          "Server configuration is missing BACKEND_API_BASE_URL for marketplace leads.",
      },
      { status: 500 },
    );
  }

  const qs = new URL(request.url).searchParams.toString();
  const url = buildBackendUrl(
    backendBaseUrl,
    `/leads/marketplace${qs ? `?${qs}` : ""}`,
  );

  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
