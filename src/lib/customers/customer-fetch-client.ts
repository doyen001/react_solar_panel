"use client";

import { store } from "@/lib/store/store";
import { clearUser } from "@/lib/store/customerAuthSlice";

let refreshInFlight: Promise<Response> | null = null;

/** Single in-flight refresh so parallel 401s do not spam `/api/customers/refresh`. */
function getRefreshPromise(): Promise<Response> {
  if (!refreshInFlight) {
    refreshInFlight = fetch("/api/customers/refresh", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

function logoutClientAndRedirect() {
  store.dispatch(clearUser());
  if (typeof window !== "undefined") {
    const path = `${window.location.pathname}${window.location.search}`;
    const url = new URL("/customers/auth", window.location.origin);
    if (path.startsWith("/customers") && !path.startsWith("/customers/auth")) {
      url.searchParams.set("from", path);
    }
    window.location.assign(url.toString());
  }
}

/**
 * Fetch with credentials; on 401, tries one refresh via `customer_refresh_token`, then retries once.
 * If refresh fails (expired/invalid refresh token), clears Redux user and redirects to sign-in.
 */
export async function fetchWithCustomerSession(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const merged: RequestInit = {
    ...init,
    credentials: init?.credentials ?? "include",
  };

  const first = await fetch(input, merged);
  if (first.status !== 401) {
    return first;
  }

  const refreshRes = await getRefreshPromise();
  if (!refreshRes.ok) {
    logoutClientAndRedirect();
    return refreshRes;
  }

  const second = await fetch(input, merged);
  if (second.status === 401) {
    logoutClientAndRedirect();
  }
  return second;
}
