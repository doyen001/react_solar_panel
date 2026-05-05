"use client";

import { useCallback, useRef, useState } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearUser } from "@/lib/store/customerAuthSlice";
import { clearInstallerUser } from "@/lib/store/installerAuthSlice";

export type PortalLogoutKind = "customer" | "installer";

function redirectAfterCustomerLogout() {
  if (typeof window === "undefined") return;
  const url = new URL("/", window.location.origin);
  // Use replace so "Back" doesn't land on protected pages after logout.
  window.location.replace(url.toString());
}

function redirectAfterInstallerLogout() {
  if (typeof window === "undefined") return;
  const url = new URL("/", window.location.origin);
  window.location.replace(url.toString());
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
