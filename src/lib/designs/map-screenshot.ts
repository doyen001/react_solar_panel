import type { DesignProposalState } from "@/lib/store/designProposalSlice";

/** Saved solar-step map capture (roof outline + panel layout), when present. */
export function designMapScreenshotUrl(
  design: { wizardData?: unknown } | null | undefined,
): string | null {
  if (!design) return null;
  const stored = design.wizardData as DesignProposalState | null | undefined;
  const url = stored?.solarDesign?.mapScreenshotDataUrl;
  return typeof url === "string" && url.startsWith("data:image/") ? url : null;
}
