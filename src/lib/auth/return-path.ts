/**
 * Shared rules for the `?from=` return path on the portal sign-in pages.
 *
 * This rule lived in two places that disagreed. The fetch client only attached
 * `from` when the current path started with `/customers`, and the sign-in page
 * only accepted a `from` that started with `/customers` — so a 401 raised
 * anywhere else lost the origin twice over. Buying from the public `/products`
 * catalogue while signed out hit exactly that: the customer was sent to
 * sign-in with no `from` at all, then dropped on the dashboard afterwards
 * instead of back at the product they were trying to buy.
 */

/** Control characters, which can slip past a naive prefix check downstream. */
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

/**
 * True for a path we are willing to send someone back to after sign-in.
 *
 * Only same-origin, absolute app paths qualify. `//evil.com` and `/\evil.com`
 * are protocol-relative URLs rather than paths — the browser would leave the
 * site — so they are rejected along with anything not starting with `/`. The
 * auth page itself is excluded too, since returning there after signing in
 * would bounce the visitor straight back to the form they just completed.
 */
export function isSafeReturnPath(
  path: string | null | undefined,
  authPrefix: string,
): path is string {
  if (!path) return false;
  if (!path.startsWith("/")) return false;
  // Protocol-relative and backslash-smuggled off-site targets.
  if (path.startsWith("//") || path.startsWith("/\\")) return false;
  if (CONTROL_CHARS.test(path)) return false;
  if (path.startsWith(authPrefix)) return false;
  return true;
}

/** The path to return to, or `fallback` when `from` is missing or unsafe. */
export function safeReturnPath(
  from: string | null | undefined,
  authPrefix: string,
  fallback: string,
): string {
  return isSafeReturnPath(from, authPrefix) ? from : fallback;
}

/**
 * True for a *full URL* whose origin is explicitly allowlisted — the SSO
 * handoff to another Easylink site (e.g. easylinkplus.com) after signing in
 * here. Kept separate from `isSafeReturnPath`, which must keep rejecting
 * every absolute URL for its own (in-app) callers.
 */
export function isSafeExternalReturnUrl(
  from: string | null | undefined,
  allowedOrigins: readonly string[],
): from is string {
  if (!from) return false;
  if (CONTROL_CHARS.test(from)) return false;
  let parsed: URL;
  try {
    parsed = new URL(from);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
  return allowedOrigins.includes(parsed.origin);
}

/**
 * The return target for the customer auth page: an in-app path, an
 * allowlisted external site (SSO handoff), or `fallback`.
 */
export function safeReturnTarget(
  from: string | null | undefined,
  authPrefix: string,
  fallback: string,
  allowedExternalOrigins: readonly string[],
): string {
  if (isSafeReturnPath(from, authPrefix)) return from;
  if (isSafeExternalReturnUrl(from, allowedExternalOrigins)) return from;
  return fallback;
}
