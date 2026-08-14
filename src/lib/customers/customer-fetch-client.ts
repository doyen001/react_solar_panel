"use client";

import { navigateWithSessionRefresh } from "@/lib/auth/app-router-navigation";
import { store } from "@/lib/store/store";
import { clearUser } from "@/lib/store/customerAuthSlice";

let refreshInFlight: Promise<Response> | null = null;
let logoutRedirectInFlight: Promise<void> | null = null;

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

function customerAuthHref(fromPath?: string): string {
  const path =
    fromPath ??
    (typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "");
  if (path.startsWith("/customers") && !path.startsWith("/customers/auth")) {
    return `/customers/auth?from=${encodeURIComponent(path)}`;
  }
  return "/customers/auth";
}

async function logoutClientAndRedirect() {
  if (logoutRedirectInFlight) {
    await logoutRedirectInFlight;
    return;
  }

  logoutRedirectInFlight = (async () => {
    store.dispatch(clearUser());
    await fetch("/api/customers/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {});

    if (typeof window !== "undefined") {
      navigateWithSessionRefresh(customerAuthHref());
    }
  })().finally(() => {
    logoutRedirectInFlight = null;
  });

  await logoutRedirectInFlight;
}

/**
 * Fetch with credentials; on 401, tries one refresh via `customer_refresh_token`, then retries once.
 * If refresh fails (expired/invalid refresh token), clears Redux + httpOnly cookies and redirects to sign-in.
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
    await logoutClientAndRedirect();
    return refreshRes;
  }

  const second = await fetch(input, merged);
  if (second.status === 401) {
    await logoutClientAndRedirect();
  }
  return second;
}
