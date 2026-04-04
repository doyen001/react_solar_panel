import { NextResponse } from "next/server";
import { buildBackendUrl } from "@/lib/customers/backend";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tiffUrl = searchParams.get("url");

  if (!tiffUrl) {
    return NextResponse.json(
      { message: "url query parameter is required." },
      { status: 400 },
    );
  }

  const backendBaseUrl = process.env.BACKEND_API_BASE_URL;

  if (!backendBaseUrl) {
    return NextResponse.json(
      { message: "Server configuration is missing BACKEND_API_BASE_URL." },
      { status: 500 },
    );
  }

  const proxyUrl = new URL(
    buildBackendUrl(backendBaseUrl, "/solar/geotiff-proxy"),
  );
  proxyUrl.searchParams.set("url", tiffUrl);

  let backendResponse: Response;

  try {
    backendResponse = await fetch(proxyUrl.toString(), { cache: "no-store" });
  } catch (error) {
    console.error("geotiff-proxy fetch error", error);
    return NextResponse.json(
      { message: "Unable to reach the GeoTIFF proxy." },
      { status: 502 },
    );
  }

  if (!backendResponse.ok) {
    return NextResponse.json(
      { message: `GeoTIFF proxy failed: ${backendResponse.status}` },
      { status: backendResponse.status },
    );
  }

  const arrayBuffer = await backendResponse.arrayBuffer();

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type":
        backendResponse.headers.get("content-type") ?? "image/tiff",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
