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
