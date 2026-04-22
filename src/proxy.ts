import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  CUSTOMER_ACCESS_COOKIE,
  CUSTOMER_REFRESH_COOKIE,
} from "@/lib/auth/customer-cookies";
import {
  INSTALLER_ACCESS_COOKIE,
  INSTALLER_REFRESH_COOKIE,
} from "@/lib/auth/installer-cookies";

function hasCustomerSession(request: NextRequest) {
  const access = request.cookies.get(CUSTOMER_ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(CUSTOMER_REFRESH_COOKIE)?.value;
  return Boolean(access || refresh);
}

function hasInstallerSession(request: NextRequest) {
  const access = request.cookies.get(INSTALLER_ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(INSTALLER_REFRESH_COOKIE)?.value;
  return Boolean(access || refresh);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const customerAuthed = hasCustomerSession(request);
  const installerAuthed = hasInstallerSession(request);

  if (pathname.startsWith("/customers/auth")) {
    if (customerAuthed) {
      return NextResponse.redirect(new URL("/customers/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!customerAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = "/customers/auth";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/installers/auth")) {
    if (installerAuthed) {
      return NextResponse.redirect(
        new URL("/installers/dashboard/home", request.url),
      );
    }
    return NextResponse.next();
  }

  if (!installerAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = "/installers/auth";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/customers/:path+", "/installers/auth", "/installers/dashboard/:path+"],
};
