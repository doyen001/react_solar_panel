"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import {
  CUSTOMER_AUTH_STORAGE_KEY,
  setCustomerSession,
  setUser,
  type CustomerUser,
} from "@/lib/store/customerAuthSlice";
import {
  INSTALLER_AUTH_STORAGE_KEY,
  setInstallerSession,
  setInstallerUser,
  type InstallerUser,
} from "@/lib/store/installerAuthSlice";
import {
  ADMIN_AUTH_STORAGE_KEY,
  setAdminSession,
  setAdminUser,
  type AdminUser,
} from "@/lib/store/adminAuthSlice";
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

function isCustomerSession(
  value: unknown,
): value is { user: CustomerUser; accessToken: string } {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  const accessToken = o.accessToken;
  return (
    isCustomerUser(o.user) &&
    typeof accessToken === "string"
  );
}

function isInstallerUser(value: unknown): value is InstallerUser {
  return isCustomerUser(value);
}

function isInstallerSession(
  value: unknown,
): value is { user: InstallerUser; accessToken: string } {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  const accessToken = o.accessToken;
  return (
    isInstallerUser(o.user) &&
    typeof accessToken === "string"
  );
}

function isAdminUser(value: unknown): value is AdminUser {
  return isCustomerUser(value);
}

function isAdminSession(
  value: unknown,
): value is { user: AdminUser; accessToken: string } {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return isAdminUser(o.user) && typeof o.accessToken === "string";
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
        if (isCustomerSession(parsed)) {
          store.dispatch(setCustomerSession(parsed));
        } else if (isCustomerUser(parsed)) {
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

    try {
      const rawAdmin = sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
      if (rawAdmin) {
        const parsed: unknown = JSON.parse(rawAdmin);
        if (isAdminSession(parsed)) {
          store.dispatch(setAdminSession(parsed));
        } else if (isAdminUser(parsed)) {
          store.dispatch(setAdminUser(parsed));
        } else {
          sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
        }
      }
    } catch {
      sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
