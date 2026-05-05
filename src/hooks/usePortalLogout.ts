"use client";

import { useCallback, useRef, useState } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearUser } from "@/lib/store/customerAuthSlice";
import { clearInstallerUser } from "@/lib/store/installerAuthSlice";

export type PortalLogoutKind = "customer" | "installer";

function redirectAfterCustomerLogout() {
  if (typeof window === "undefined") return;
  const path = `${window.location.pathname}${window.location.search}`;
  const url = new URL("/customers/auth", window.location.origin);
  if (path.startsWith("/customers") && !path.startsWith("/customers/auth")) {
    url.searchParams.set("from", path);
  }
  window.location.assign(url.toString());
}

function redirectAfterInstallerLogout() {
  if (typeof window === "undefined") return;
  const path = `${window.location.pathname}${window.location.search}`;
  const url = new URL("/installers/auth", window.location.origin);
  if (
    (path.startsWith("/installers") && !path.startsWith("/installers/auth")) ||
    path.startsWith("/master")
  ) {
    url.searchParams.set("from", path);
  }
  window.location.assign(url.toString());
}

/**
 * Calls the matching Next.js logout route (clears httpOnly cookies), clears Redux,
 * and redirects to the portal sign-in page.
 */
export function usePortalLogout(kind: PortalLogoutKind) {
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  const logout = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    const endpoint =
      kind === "customer"
        ? "/api/customers/logout"
        : "/api/installers/logout";
    try {
      await fetch(endpoint, { method: "POST", credentials: "include" });
    } catch {
      /* still clear client session */
    }

    if (kind === "customer") {
      dispatch(clearUser());
      redirectAfterCustomerLogout();
    } else {
      dispatch(clearInstallerUser());
      dispatch(clearUser());
      redirectAfterInstallerLogout();
    }
  }, [dispatch, kind]);

  return { logout, pending };
}
