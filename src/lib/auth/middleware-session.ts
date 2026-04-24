/** Decode JWT payload `exp` (seconds since epoch). Edge-safe; no signature verification. */
export function decodeJwtExp(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const json = atob(padded);
    const obj = JSON.parse(json) as { exp?: unknown };
    return typeof obj.exp === "number" ? obj.exp : null;
  } catch {
    return null;
  }
}

/** Uses JWT `exp` only; invalid/missing payload treated as expired. */
export function isAccessTokenExpired(
  accessToken: string | undefined,
  skewSec = 30,
): boolean {
  if (!accessToken) return true;
  const exp = decodeJwtExp(accessToken);
  if (exp === null) return true;
  return exp * 1000 <= Date.now() + skewSec * 1000;
}
