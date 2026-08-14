"use client";

import { navigateWithSessionRefresh } from "@/lib/auth/app-router-navigation";
import { store } from "@/lib/store/store";
import { clearInstallerUser } from "@/lib/store/installerAuthSlice";

let refreshInFlight: Promise<Response> | null = null;
let logoutRedirectInFlight: Promise<void> | null = null;

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

function installerAuthHref(fromPath?: string): string {
  const path =
    fromPath ??
    (typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "");
  if (
    (path.startsWith("/installers") && !path.startsWith("/installers/auth")) ||
    path.startsWith("/master")
  ) {
    return `/installers/auth?from=${encodeURIComponent(path)}`;
  }
  return "/installers/auth";
}

async function logoutClientAndRedirect() {
  if (logoutRedirectInFlight) {
    await logoutRedirectInFlight;
    return;
  }

  logoutRedirectInFlight = (async () => {
    store.dispatch(clearInstallerUser());
    await fetch("/api/installers/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {});

    if (typeof window !== "undefined") {
      navigateWithSessionRefresh(installerAuthHref());
    }
  })().finally(() => {
    logoutRedirectInFlight = null;
  });

  await logoutRedirectInFlight;
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
    await logoutClientAndRedirect();
    return refreshRes;
  }

  const second = await fetch(input, merged);
  if (second.status === 401) {
    await logoutClientAndRedirect();
  }
  return second;
}
