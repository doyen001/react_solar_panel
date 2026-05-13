import { NextResponse } from "next/server";
import { signInSchema } from "@/lib/validations/auth";
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
import { checkPortalRole } from "@/lib/auth/portal-role";

const LOGIN_PATH = "/auth/login";

type BackendLoginPayload = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string | null;
    role: string;
    emailVerified: boolean;
  };
};

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

  const parsed = signInSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please correct the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { email, password, remember } = parsed.data;

  const backendBaseUrl = process.env.BACKEND_API_BASE_URL;

  if (!backendBaseUrl) {
    return NextResponse.json(
      {
        message:
          "Server configuration is missing BACKEND_API_BASE_URL for login.",
      },
      { status: 500 },
    );
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  let backendResponse: Response;

  try {
    backendResponse = await fetch(buildBackendUrl(backendBaseUrl, LOGIN_PATH), {
      method: "POST",
      headers,
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch (error) {
    console.error("login fetch error", error);
    return NextResponse.json(
      { message: "Unable to reach the login service." },
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
    const fieldErrors =
      payload &&
      typeof payload === "object" &&
      "fieldErrors" in payload &&
      payload.fieldErrors &&
      typeof payload.fieldErrors === "object"
        ? payload.fieldErrors
        : undefined;

    return NextResponse.json(
      {
        message: extractMessage(
          payload,
          "Invalid email or password. Please try again.",
        ),
        ...(fieldErrors ? { fieldErrors } : {}),
      },
      { status: backendResponse.status },
    );
  }

  const data = unwrapApiData<BackendLoginPayload>(payload);
  if (
    !data ||
    typeof data.accessToken !== "string" ||
    typeof data.refreshToken !== "string"
  ) {
    return NextResponse.json(
      { message: "Unexpected response from login service." },
      { status: 502 },
    );
  }

  // Role/portal gate: this proxy only accepts CUSTOMER accounts.
  // We do NOT set any auth cookies if the user picked the wrong portal.
  const roleCheck = checkPortalRole("customer", data.user?.role);
  if (!roleCheck.ok) {
    return NextResponse.json(
      {
        message: roleCheck.message,
        portalMismatch: {
          portal: roleCheck.portalLabel,
          role: roleCheck.role,
          suggested: roleCheck.suggested,
        },
      },
      { status: roleCheck.status },
    );
  }

  const base = cookieBaseOptions();
  const refreshCookieOpts = remember
    ? { ...base, maxAge: REFRESH_COOKIE_MAX_AGE_SEC }
    : { ...base };

  const res = NextResponse.json(
    {
      message: "Signed in successfully.",
      user: data.user,
      accessToken: data.accessToken,
    },
    { status: 200 },
  );

  res.cookies.set(CUSTOMER_ACCESS_COOKIE, data.accessToken, {
    ...base,
    maxAge: ACCESS_COOKIE_MAX_AGE_SEC,
  });
  res.cookies.set(CUSTOMER_REFRESH_COOKIE, data.refreshToken, refreshCookieOpts);

  return res;
}
