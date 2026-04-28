/** Normalize URLs that users paste without a scheme (e.g. google.com → https://google.com). */
export function normalizeMarkdownUrl(url: string): string {
  const t = url.trim();
  if (!t) return t;
  if (/^(https?|mailto|tel):/i.test(t)) return t;
  if (t.startsWith("/") || t.startsWith("./") || t.startsWith("../")) return t;
  return `https://${t}`;
}
