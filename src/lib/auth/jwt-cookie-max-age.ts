/**
 * Parse JWT-style duration strings (same format as backend `ms` / jsonwebtoken).
 * Examples: "15m", "1d", "7d"
 */
export function parseDurationToSeconds(
  value: string | undefined,
  fallbackSec: number,
): number {
  if (!value?.trim()) return fallbackSec;

  const match = /^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/i.exec(value.trim());
  if (!match) return fallbackSec;

  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return fallbackSec;

  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = {
    ms: 0.001,
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  return Math.max(1, Math.round(amount * multipliers[unit]!));
}

/** Keep in sync with backend `JWT_ACCESS_EXPIRES_IN` (default 1d). */
export const ACCESS_COOKIE_MAX_AGE_SEC = parseDurationToSeconds(
  process.env.JWT_ACCESS_EXPIRES_IN,
  24 * 60 * 60,
);

/** Keep in sync with backend `JWT_REFRESH_EXPIRES_IN` (default 7d). */
export const REFRESH_COOKIE_MAX_AGE_SEC = parseDurationToSeconds(
  process.env.JWT_REFRESH_EXPIRES_IN,
  7 * 24 * 60 * 60,
);
