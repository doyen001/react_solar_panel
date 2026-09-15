/**
 * Portal entry points, shared by the code that *sends* someone to sign in and
 * the code that decides where to put them afterwards. Keeping the two in one
 * place is what stops them drifting apart.
 */

export const CUSTOMER_AUTH_PATH = "/customers/auth";

/** Where a customer lands after signing in with no return path to honour. */
export const CUSTOMER_HOME_PATH = "/customers/dashboard";

/**
 * Other Easylink sites allowed as an SSO return target from this auth page —
 * must match the backend's SSO_ALLOWED_ORIGINS. Env-overridable so a preview
 * deploy of the ad site (a different origin) can still complete the handoff.
 */
export const SSO_ALLOWED_ORIGINS: readonly string[] = (
  process.env.NEXT_PUBLIC_SSO_ALLOWED_ORIGINS ||
  "https://easylinkplus.com,http://localhost:3002"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
