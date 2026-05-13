"use client";

import { useCallback, useRef, useState } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearUser } from "@/lib/store/customerAuthSlice";
import { clearInstallerUser } from "@/lib/store/installerAuthSlice";
import { clearAdminUser } from "@/lib/store/adminAuthSlice";

export type PortalLogoutKind =
  | "customer"
  | "installer"
  | "admin"

function redirectAfterLogout() {
  if (typeof window === "undefined") return;
  const url = new URL("/", window.location.origin);
  // Use replace so "Back" doesn't land on protected pages after logout.
  window.location.replace(url.toString());
}

/**
 * Calls the matching Next.js logout route (clears httpOnly cookies), clears
 * the corresponding Redux slice, and redirects home.
 *
 * Each `kind` strictly clears only its own portal's session. The `master`
 * kind is a special case used by the shared /master/dashboard landing page,
 * which is reachable by both ADMIN and DISTRIBUTOR accounts.
 */
export function usePortalLogout(kind: PortalLogoutKind) {
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  const logout = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);

    const endpoints =
      kind === "customer"
        ? ["/api/customers/logout"]
        : kind === "installer"
          ? ["/api/installers/logout"]
            : kind === "admin"
              ? ["/api/admin/logout"]
              : // master: shared dashboard for ADMIN + DISTRIBUTOR
                ["/api/admin/logout"];

    try {
      await Promise.allSettled(
        endpoints.map((endpoint) =>
          fetch(endpoint, { method: "POST", credentials: "include" }),
        ),
      );
    } catch {
      /* still clear client session */
    }

    if (kind === "customer") {
      dispatch(clearUser());
    } else if (kind === "installer") {
      dispatch(clearInstallerUser());
    } else if (kind === "admin") {
      dispatch(clearAdminUser());
    } else {
      // master: clear both possible session slices for the shared dashboard
      dispatch(clearAdminUser());
    }

    redirectAfterLogout();
  }, [dispatch, kind]);

  return { logout, pending };
}
