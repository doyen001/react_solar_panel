"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import {
  CUSTOMER_AUTH_STORAGE_KEY,
  setUser,
  type CustomerUser,
} from "@/lib/store/customerAuthSlice";
import {
  INSTALLER_AUTH_STORAGE_KEY,
  setInstallerSession,
  setInstallerUser,
  type InstallerUser,
} from "@/lib/store/installerAuthSlice";
import { store } from "@/lib/store/store";

function isCustomerUser(value: unknown): value is CustomerUser {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.email === "string" &&
    typeof o.firstName === "string" &&
    typeof o.lastName === "string" &&
    (o.address === null || typeof o.address === "string") &&
    typeof o.role === "string" &&
    typeof o.emailVerified === "boolean"
  );
}

function isInstallerUser(value: unknown): value is InstallerUser {
  return isCustomerUser(value);
}

function isInstallerSession(
  value: unknown,
): value is { user: InstallerUser; accessToken: string | null } {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  const accessToken = o.accessToken;
  return (
    isInstallerUser(o.user) &&
    (accessToken === null || typeof accessToken === "string")
  );
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const rawCustomer = sessionStorage.getItem(CUSTOMER_AUTH_STORAGE_KEY);
      if (rawCustomer) {
        const parsed: unknown = JSON.parse(rawCustomer);
        if (isCustomerUser(parsed)) {
          store.dispatch(setUser(parsed));
        } else {
          sessionStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
        }
      }
    } catch {
      sessionStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
    }

    try {
      const rawInstaller = sessionStorage.getItem(INSTALLER_AUTH_STORAGE_KEY);
      if (rawInstaller) {
        const parsed: unknown = JSON.parse(rawInstaller);
        if (isInstallerSession(parsed)) {
          store.dispatch(setInstallerSession(parsed));
        } else if (isInstallerUser(parsed)) {
          store.dispatch(setInstallerUser(parsed));
        } else {
          sessionStorage.removeItem(INSTALLER_AUTH_STORAGE_KEY);
        }
      }
    } catch {
      sessionStorage.removeItem(INSTALLER_AUTH_STORAGE_KEY);
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
