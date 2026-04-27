"use client";

import { store } from "@/lib/store/store";
import { clearInstallerUser } from "@/lib/store/installerAuthSlice";

let refreshInFlight: Promise<Response> | null = null;

function getRefreshPromise(): Promise<Response> {
  if (!refreshInFlight) {
    refreshInFlight = fetch("/api/installers/refresh", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

function logoutClientAndRedirect() {
  store.dispatch(clearInstallerUser());
  if (typeof window !== "undefined") {
    const path = `${window.location.pathname}${window.location.search}`;
    const url = new URL("/installers/auth", window.location.origin);
    if (
      path.startsWith("/installers") &&
      !path.startsWith("/installers/auth")
    ) {
      url.searchParams.set("from", path);
    }
    window.location.assign(url.toString());
  }
}

/** Fetch with credentials; refresh installer session once on 401 (same pattern as customer). */
export async function fetchWithInstallerSession(
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
