import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  clearCustomerAuthCookies,
  CUSTOMER_ACCESS_COOKIE,
  CUSTOMER_REFRESH_COOKIE,
  setCustomerSessionCookies,
} from "@/lib/auth/customer-cookies";
import { executeTokenRefresh } from "@/lib/auth/execute-token-refresh";
import {
  clearInstallerAuthCookies,
  INSTALLER_ACCESS_COOKIE,
  INSTALLER_REFRESH_COOKIE,
  setInstallerSessionCookies,
} from "@/lib/auth/installer-cookies";
import { isAccessTokenExpired } from "@/lib/auth/middleware-session";

const CUSTOMER_DASHBOARD = "/customers/dashboard";
const CUSTOMER_LOGIN = "/customers/auth";
const INSTALLER_DASHBOARD_HOME = "/installers/dashboard/home";
const INSTALLER_LOGIN = "/installers/auth";

function customerLoginRedirect(request: NextRequest, fromPath: string) {
  const url = request.nextUrl.clone();
  url.pathname = CUSTOMER_LOGIN;
  url.searchParams.set("from", fromPath);
  return NextResponse.redirect(url);
}

function installerLoginRedirect(request: NextRequest, fromPath: string) {
  const url = request.nextUrl.clone();
  url.pathname = INSTALLER_LOGIN;
  url.searchParams.set("from", fromPath);
  return NextResponse.redirect(url);
}

async function handleCustomerAuthPage(request: NextRequest): Promise<NextResponse> {
  const access = request.cookies.get(CUSTOMER_ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(CUSTOMER_REFRESH_COOKIE)?.value;

  if (access && !isAccessTokenExpired(access)) {
    return NextResponse.redirect(new URL(CUSTOMER_DASHBOARD, request.url));
  }

  if (!refresh) {
    return NextResponse.next();
  }

  const outcome = await executeTokenRefresh(refresh);
  if (outcome.ok) {
    const redirect = NextResponse.redirect(
      new URL(CUSTOMER_DASHBOARD, request.url),
    );
    setCustomerSessionCookies(redirect, {
      accessToken: outcome.accessToken,
      refreshToken: outcome.refreshToken,
    });
    return redirect;
  }
  if (outcome.clearSession) {
    const next = NextResponse.next();
    clearCustomerAuthCookies(next);
    return next;
  }
  return NextResponse.next();
}

async function handleCustomerProtected(
  request: NextRequest,
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const access = request.cookies.get(CUSTOMER_ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(CUSTOMER_REFRESH_COOKIE)?.value;

  if (access && !isAccessTokenExpired(access)) {
    return NextResponse.next();
  }

  if (refresh) {
    const outcome = await executeTokenRefresh(refresh);
    if (outcome.ok) {
      const next = NextResponse.next();
      setCustomerSessionCookies(next, {
        accessToken: outcome.accessToken,
        refreshToken: outcome.refreshToken,
      });
      return next;
    }
    if (outcome.clearSession) {
      const redirect = customerLoginRedirect(request, pathname);
      clearCustomerAuthCookies(redirect);
      return redirect;
    }
    return NextResponse.next();
  }

  return customerLoginRedirect(request, pathname);
}

async function handleInstallerAuthPage(request: NextRequest): Promise<NextResponse> {
  const access = request.cookies.get(INSTALLER_ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(INSTALLER_REFRESH_COOKIE)?.value;

  if (access && !isAccessTokenExpired(access)) {
    return NextResponse.redirect(new URL(INSTALLER_DASHBOARD_HOME, request.url));
  }

  if (!refresh) {
    return NextResponse.next();
  }

  const outcome = await executeTokenRefresh(refresh);
  if (outcome.ok) {
    const redirect = NextResponse.redirect(
      new URL(INSTALLER_DASHBOARD_HOME, request.url),
    );
    setInstallerSessionCookies(redirect, {
      accessToken: outcome.accessToken,
      refreshToken: outcome.refreshToken,
    });
    return redirect;
  }
  if (outcome.clearSession) {
    const next = NextResponse.next();
    clearInstallerAuthCookies(next);
    return next;
  }
  return NextResponse.next();
}

async function handleInstallerProtected(
  request: NextRequest,
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const access = request.cookies.get(INSTALLER_ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(INSTALLER_REFRESH_COOKIE)?.value;

  if (access && !isAccessTokenExpired(access)) {
    return NextResponse.next();
  }

  if (refresh) {
    const outcome = await executeTokenRefresh(refresh);
    if (outcome.ok) {
      const next = NextResponse.next();
      setInstallerSessionCookies(next, {
        accessToken: outcome.accessToken,
        refreshToken: outcome.refreshToken,
      });
      return next;
    }
    if (outcome.clearSession) {
      const redirect = installerLoginRedirect(request, pathname);
      clearInstallerAuthCookies(redirect);
      return redirect;
    }
    return NextResponse.next();
  }

  return installerLoginRedirect(request, pathname);
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/customers/auth")) {
    return handleCustomerAuthPage(request);
  }

  if (pathname.startsWith("/customers")) {
    return handleCustomerProtected(request);
  }

  if (pathname.startsWith("/installers/auth")) {
    return handleInstallerAuthPage(request);
  }

  if (pathname.startsWith("/installers/dashboard")) {
    return handleInstallerProtected(request);
  }

  if (pathname.startsWith("/master")) {
    return handleInstallerProtected(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/customers/:path*",
    "/installers/auth",
    "/installers/dashboard/:path*",
    "/master/:path*",
  ],
};
