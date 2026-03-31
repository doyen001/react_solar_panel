import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  buildBackendUrl,
  extractMessage,
} from "@/lib/customers/backend";
import {
  clearCustomerAuthCookies,
  CUSTOMER_ACCESS_COOKIE,
} from "@/lib/auth/customer-cookies";

const LOGOUT_PATH = "/auth/logout";

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
        clearCustomerAuthCookies(res);
        return res;
      }
    } catch (error) {
      console.error("logout fetch error", error);
      const res = NextResponse.json(
        { message: "Unable to reach the logout service." },
        { status: 502 },
      );
      clearCustomerAuthCookies(res);
      return res;
    }
  }

  const res = NextResponse.json({ message: "Signed out." }, { status: 200 });
  clearCustomerAuthCookies(res);
  return res;
}
