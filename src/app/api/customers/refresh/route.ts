import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  buildBackendUrl,
  extractMessage,
  unwrapApiData,
} from "@/lib/customers/backend";
import {
  ACCESS_COOKIE_MAX_AGE_SEC,
  cookieBaseOptions,
  CUSTOMER_ACCESS_COOKIE,
  CUSTOMER_REFRESH_COOKIE,
  REFRESH_COOKIE_MAX_AGE_SEC,
} from "@/lib/auth/customer-cookies";

const REFRESH_PATH = "/auth/refresh-token";

const refreshBodySchema = z.object({
  refreshToken: z.string().min(1),
});

export async function POST(request: Request) {
  const jar = await cookies();
  let refreshToken = jar.get(CUSTOMER_REFRESH_COOKIE)?.value ?? null;

  if (!refreshToken) {
    try {
      const body = await request.json();
      const parsed = refreshBodySchema.safeParse(body);
      if (parsed.success) {
        refreshToken = parsed.data.refreshToken;
      }
    } catch {
      /* body optional */
    }
  }

  if (!refreshToken) {
    return NextResponse.json(
      { message: "No refresh token available." },
      { status: 401 },
    );
  }

  const backendBaseUrl = process.env.BACKEND_API_BASE_URL;

  if (!backendBaseUrl) {
    return NextResponse.json(
      {
        message:
          "Server configuration is missing BACKEND_API_BASE_URL for refresh.",
      },
      { status: 500 },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(
      buildBackendUrl(backendBaseUrl, REFRESH_PATH),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      },
    );
  } catch (error) {
    console.error("refresh fetch error", error);
    return NextResponse.json(
      { message: "Unable to reach the auth service." },
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
        message: extractMessage(payload, "Session expired. Please sign in again."),
      },
      { status: backendResponse.status },
    );
  }

  const data = unwrapApiData<{
    accessToken: string;
    refreshToken: string;
  }>(payload);

  if (
    !data ||
    typeof data.accessToken !== "string" ||
    typeof data.refreshToken !== "string"
  ) {
    return NextResponse.json(
      { message: "Unexpected response from auth service." },
      { status: 502 },
    );
  }

  const base = cookieBaseOptions();
  const res = NextResponse.json({ message: "Session refreshed." }, { status: 200 });

  res.cookies.set(CUSTOMER_ACCESS_COOKIE, data.accessToken, {
    ...base,
    maxAge: ACCESS_COOKIE_MAX_AGE_SEC,
  });
  res.cookies.set(CUSTOMER_REFRESH_COOKIE, data.refreshToken, {
    ...base,
    maxAge: REFRESH_COOKIE_MAX_AGE_SEC,
  });

  return res;
}
