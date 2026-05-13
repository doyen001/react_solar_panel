/**
 * Maps each login portal to the set of roles allowed to sign in there.
 * The proxy routes use this to reject sign-ins where a user's role does
 * not match the portal they are using (e.g. a CUSTOMER trying to sign in
 * via the installer or distributor portal).
 */

export type PortalKey = "customer" | "installer" | "master";

export type UserRole = "CUSTOMER" | "INSTALLER" | "ADMIN" | string;

/**
 * Strict portal/role mapping. Each portal accepts ONLY the roles listed below.
 * - customer    → CUSTOMER only.
 * - installer   → INSTALLER only.
 * - distributor → DISTRIBUTOR only (signed in via /master/auth).
 * - master      → ADMIN only (signed in via /admin/auth).
 */
const PORTAL_RULES: Record<
  PortalKey,
  { label: string; allowed: UserRole[] }
> = {
  customer: { label: "customer", allowed: ["CUSTOMER"] },
  installer: { label: "installer", allowed: ["INSTALLER"] },
  master: { label: "distributor", allowed: ["ADMIN"] },
};

export function normalizePortal(value: unknown, fallback: PortalKey): PortalKey {
  if (typeof value !== "string") return fallback;
  const lower = value.toLowerCase();
  if (
    lower === "customer" ||
    lower === "installer" ||
    lower === "master"
  ) {
    return lower;
  }
  return fallback;
}

export function friendlyRoleLabel(role: UserRole): string {
  switch (role) {
    case "CUSTOMER":
      return "Customer";
    case "INSTALLER":
      return "Installer";
    case "ADMIN":
      return "Distributor";
    default:
      return role;
  }
}

export function suggestedPortalForRole(role: UserRole): {
  key: PortalKey;
  label: string;
  url: string;
} | null {
  switch (role) {
    case "CUSTOMER":
      return { key: "customer", label: "customer", url: "/customers/auth" };
    case "INSTALLER":
      return { key: "installer", label: "installer", url: "/installers/auth" };
    case "ADMIN":
      return { key: "master", label: "distributor", url: "/admin/auth" };
    default:
      return null;
  }
}

export type PortalRoleCheckResult =
  | { ok: true }
  | {
      ok: false;
      status: number;
      message: string;
      portalLabel: string;
      role: UserRole;
      suggested: { key: PortalKey; label: string; url: string } | null;
    };

export function checkPortalRole(
  portal: PortalKey,
  role: UserRole | null | undefined,
): PortalRoleCheckResult {
  if (!role) {
    return {
      ok: false,
      status: 403,
      message: "Unable to determine your account role. Please contact support.",
      portalLabel: PORTAL_RULES[portal].label,
      role: "UNKNOWN",
      suggested: null,
    };
  }

  const rule = PORTAL_RULES[portal];
  if (rule.allowed.includes(role)) {
    return { ok: true };
  }

  const friendly = friendlyRoleLabel(role);
  const suggested = suggestedPortalForRole(role);
  const base = `Your role is ${friendly}, but this is the ${rule.label} login portal.`;
  const tail = suggested
    ? ` Please use the ${suggested.label} login portal instead.`
    : "";
  return {
    ok: false,
    status: 403,
    message: `${base}${tail}`,
    portalLabel: rule.label,
    role,
    suggested,
  };
}
