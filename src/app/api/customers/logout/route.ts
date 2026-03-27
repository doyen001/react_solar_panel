import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  buildBackendUrl,
  extractMessage,
} from "@/lib/customers/backend";
import {
  CUSTOMER_ACCESS_COOKIE,
  CUSTOMER_REFRESH_COOKIE,
} from "@/lib/auth/customer-cookies";

const LOGOUT_PATH = "/auth/logout";

function clearAuthCookies(response: NextResponse) {
  response.cookies.set(CUSTOMER_ACCESS_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set(CUSTOMER_REFRESH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function POST() {
  const jar = await cookies();
  const accessToken = jar.get(CUSTOMER_ACCESS_COOKIE)?.value;

  const backendBaseUrl = process.env.BACKEND_API_BASE_URL;

  if (backendBaseUrl && accessToken) {
    try {
      const backendResponse = await fetch(
        buildBackendUrl(backendBaseUrl, LOGOUT_PATH),
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        },
      );

      if (!backendResponse.ok) {
        const text = await backendResponse.text();
        let payload: unknown = null;
        if (text) {
          try {
            payload = JSON.parse(text);
          } catch {
            payload = null;
          }
        }
        const res = NextResponse.json(
          {
            message: extractMessage(
              payload,
              "Unable to complete logout on the server.",
            ),
          },
          { status: backendResponse.status },
        );
        clearAuthCookies(res);
        return res;
      }
    } catch (error) {
      console.error("logout fetch error", error);
      const res = NextResponse.json(
        { message: "Unable to reach the logout service." },
        { status: 502 },
      );
      clearAuthCookies(res);
      return res;
    }
  }

  const res = NextResponse.json({ message: "Signed out." }, { status: 200 });
  clearAuthCookies(res);
  return res;
}
