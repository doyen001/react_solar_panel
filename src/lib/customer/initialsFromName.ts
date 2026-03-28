/**
 * Two-letter initials from a person’s name: first letter of first name + first letter of last name.
 * Falls back sensibly for single names or missing parts.
 */
export function initialsFromPersonName(
  firstName?: string | null,
  lastName?: string | null,
): string {
  const f = firstName?.trim() ?? "";
  const l = lastName?.trim() ?? "";
  const fc = f[0];
  const lc = l[0];
  if (fc && lc) return (fc + lc).toUpperCase();
  if (fc) {
    if (f.length >= 2) return (f[0] + f[1]).toUpperCase();
    return (fc + fc).toUpperCase();
  }
  if (lc) {
    if (l.length >= 2) return (l[0] + l[1]).toUpperCase();
    return (lc + lc).toUpperCase();
  }
  return "??";
}

/**
 * Two-letter initials from a display name (e.g. org or full name string).
 * Strips parenthetical suffixes like " (HQ)", then uses the first letter of the first two words.
 */
export function initialsFromDisplayName(name: string): string {
  const cleaned = name.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0];
    const b = parts[1][0];
    if (a && b) return (a + b).toUpperCase();
  }
  if (parts.length === 1) {
    const w = parts[0];
    if (w.length >= 2) return (w[0] + w[1]).toUpperCase();
    if (w.length === 1) return (w[0] + w[0]).toUpperCase();
  }
  return "??";
}
