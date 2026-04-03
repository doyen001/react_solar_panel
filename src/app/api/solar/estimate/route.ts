import { NextResponse } from "next/server";
import {
  buildBackendUrl,
  extractMessage,
  unwrapApiData,
} from "@/lib/customers/backend";
import type { SolarEstimateResult } from "@/types/solar";

const SOLAR_ESTIMATE_PATH = "/solar/estimate";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("latitude" in body) ||
    !("longitude" in body)
  ) {
    return NextResponse.json(
      { message: "latitude and longitude are required." },
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

  let backendResponse: Response;

  try {
    backendResponse = await fetch(
      buildBackendUrl(backendBaseUrl, SOLAR_ESTIMATE_PATH),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );
  } catch (error) {
    console.error("solar estimate fetch error", error);
    return NextResponse.json(
      { message: "Unable to reach the solar estimation service." },
      { status: 502 },
    );
  }

  const responseText = await backendResponse.text();
  let payload: unknown = null;

  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = null;
    }
  }

  if (!backendResponse.ok) {
    return NextResponse.json(
      {
        message: extractMessage(
          payload,
          "Solar estimation failed. Please try again.",
        ),
      },
      { status: backendResponse.status },
    );
  }

  const data = unwrapApiData<SolarEstimateResult>(payload);

  if (!data) {
    return NextResponse.json(
      { message: "Unexpected response from solar service." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true, data }, { status: 200 });
}
