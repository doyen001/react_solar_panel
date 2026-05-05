import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { INSTALLER_ACCESS_COOKIE } from "@/lib/auth/installer-cookies";
import { CUSTOMER_ACCESS_COOKIE } from "@/lib/auth/customer-cookies";
import { buildBackendUrl } from "@/lib/customers/backend";

export type BackendPortal = "customer" | "installer";

export async function backendAuthedFetch(
  portal: BackendPortal,
  path: string,
  init?: RequestInit,
): Promise<Response | NextResponse> {
  const jar = await cookies();
  const cookieName =
    portal === "customer"
      ? CUSTOMER_ACCESS_COOKIE
      : INSTALLER_ACCESS_COOKIE;
  const token = jar.get(cookieName)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const backendBaseUrl = process.env.BACKEND_API_BASE_URL;
  if (!backendBaseUrl) {
    return NextResponse.json(
      {
        message:
          "Server configuration is missing BACKEND_API_BASE_URL for messaging.",
      },
      { status: 500 },
    );
  }

  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    return await fetch(buildBackendUrl(backendBaseUrl, path), {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    // Most common in local dev when the Express backend is down/restarting (ECONNRESET).
    return NextResponse.json(
      { message: "Unable to reach the backend service." },
      { status: 502 },
    );
  }
}

/** Pass JSON body through from Route Handlers to the Express API. */
export async function forwardBackendJson(
  res: Response | NextResponse,
): Promise<NextResponse> {
  if (res instanceof NextResponse) return res;
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
