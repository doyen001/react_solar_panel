import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  CUSTOMER_ACCESS_COOKIE,
  CUSTOMER_REFRESH_COOKIE,
} from "@/lib/auth/customer-cookies";

function hasCustomerSession(request: NextRequest) {
  const access = request.cookies.get(CUSTOMER_ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(CUSTOMER_REFRESH_COOKIE)?.value;
  return Boolean(access || refresh);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = hasCustomerSession(request);

  if (pathname.startsWith("/customers/auth")) {
    if (authed) {
      return NextResponse.redirect(new URL("/customers", request.url));
    }
    return NextResponse.next();
  }

  if (!authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/customers/auth";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/customers/:path+"],
};
