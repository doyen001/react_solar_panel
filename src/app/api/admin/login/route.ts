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
  ADMIN_ACCESS_COOKIE,
  ADMIN_REFRESH_COOKIE,
  REFRESH_COOKIE_MAX_AGE_SEC,
} from "@/lib/auth/admin-cookies";
import {
  INSTALLER_ACCESS_COOKIE,
  INSTALLER_REFRESH_COOKIE,
} from "@/lib/auth/installer-cookies";
import { checkPortalRole } from "@/lib/auth/portal-role";
import type { CustomerUser } from "@/lib/store/customerAuthSlice";

const LOGIN_PATH = "/auth/login";

type BackendLoginPayload = {
  accessToken: string;
  refreshToken: string;
  user: CustomerUser;
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
    console.error("admin login fetch error", error);
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

  // Role/portal gate: only ADMIN accounts may sign in here.
  const roleCheck = checkPortalRole("master", data.user?.role);
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

  res.cookies.set(ADMIN_ACCESS_COOKIE, data.accessToken, {
    ...base,
    maxAge: ACCESS_COOKIE_MAX_AGE_SEC,
  });
  res.cookies.set(ADMIN_REFRESH_COOKIE, data.refreshToken, refreshCookieOpts);

  /**
   * The admin user account also needs to call existing `/api/installers/*`
   * proxies (which read the installer cookie) to power /master/dashboard.
   * The JWT itself carries `role: "ADMIN"`, so backend RBAC still gates
   * access correctly. The strict portal/role check above is what prevents
   * cross-role sign-in via the installer auth page.
   */
  res.cookies.set(INSTALLER_ACCESS_COOKIE, data.accessToken, {
    ...base,
    maxAge: ACCESS_COOKIE_MAX_AGE_SEC,
  });
  res.cookies.set(INSTALLER_REFRESH_COOKIE, data.refreshToken, refreshCookieOpts);

  return res;
}
