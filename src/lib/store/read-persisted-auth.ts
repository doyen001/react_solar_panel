import type { AdminAuthState, AdminUser } from "@/lib/store/adminAuthSlice";
import { ADMIN_AUTH_STORAGE_KEY } from "@/lib/store/adminAuthSlice";
import type { CustomerAuthState, CustomerUser } from "@/lib/store/customerAuthSlice";
import { CUSTOMER_AUTH_STORAGE_KEY } from "@/lib/store/customerAuthSlice";
import type { InstallerAuthState, InstallerUser } from "@/lib/store/installerAuthSlice";
import { INSTALLER_AUTH_STORAGE_KEY } from "@/lib/store/installerAuthSlice";

function isPortalUser(value: unknown): value is CustomerUser {
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

function isPortalSession(
  value: unknown,
): value is { user: CustomerUser; accessToken: string } {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return isPortalUser(o.user) && typeof o.accessToken === "string";
}

function readCustomerAuth(): CustomerAuthState | undefined {
  try {
    const raw = sessionStorage.getItem(CUSTOMER_AUTH_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    if (isPortalSession(parsed)) {
      return { user: parsed.user, accessToken: parsed.accessToken };
    }
    if (isPortalUser(parsed)) {
      return { user: parsed, accessToken: null };
    }
    sessionStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
  } catch {
    sessionStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
  }
  return undefined;
}

function readInstallerAuth(): InstallerAuthState | undefined {
  try {
    const raw = sessionStorage.getItem(INSTALLER_AUTH_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    if (isPortalSession(parsed)) {
      return { user: parsed.user as InstallerUser, accessToken: parsed.accessToken };
    }
    if (isPortalUser(parsed)) {
      return { user: parsed as InstallerUser, accessToken: null };
    }
    sessionStorage.removeItem(INSTALLER_AUTH_STORAGE_KEY);
  } catch {
    sessionStorage.removeItem(INSTALLER_AUTH_STORAGE_KEY);
  }
  return undefined;
}

function readAdminAuth(): AdminAuthState | undefined {
  try {
    const raw = sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    if (isPortalSession(parsed)) {
      return { user: parsed.user as AdminUser, accessToken: parsed.accessToken };
    }
    if (isPortalUser(parsed)) {
      return { user: parsed as AdminUser, accessToken: null };
    }
    sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  } catch {
    sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  }
  return undefined;
}

/** Hydrate Redux from sessionStorage on the client before the first render. */
export function readPersistedAuthPreload():
  | {
      customerAuth?: CustomerAuthState;
      installerAuth?: InstallerAuthState;
      adminAuth?: AdminAuthState;
    }
  | undefined {
  if (typeof window === "undefined") return undefined;

  const customerAuth = readCustomerAuth();
  const installerAuth = readInstallerAuth();
  const adminAuth = readAdminAuth();

  if (!customerAuth && !installerAuth && !adminAuth) return undefined;

  return {
    ...(customerAuth ? { customerAuth } : {}),
    ...(installerAuth ? { installerAuth } : {}),
    ...(adminAuth ? { adminAuth } : {}),
  };
}

export function readInstallerAuthFromSession(): InstallerAuthState | undefined {
  if (typeof window === "undefined") return undefined;
  return readInstallerAuth();
}
