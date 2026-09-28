import type { DesignProposalState } from "@/lib/store/designProposalSlice";
import { DESIGNS_LOCATION_STEP } from "@/utils/constant";

const STATIC_MAPS_ENDPOINT = "https://maps.googleapis.com/maps/api/staticmap";

/**
 * Roughly the width:height of the preview frames this fills (373:174), so the
 * satellite tile isn't cropped hard by `object-cover`. `scale=2` doubles the
 * pixels for retina without counting as a larger (differently billed) size.
 */
const SIZE = "640x300";

type DesignLike = {
  address?: string | null;
  wizardData?: unknown;
} | null | undefined;

/**
 * The exact pin the customer dropped on the wizard's location step. Preferred
 * over the typed address because it's what the solar estimate was actually
 * run against — the address string can geocode to the street, or to the wrong
 * unit in a complex.
 */
function designPin(design: DesignLike): string | null {
  const stored = (design?.wizardData ?? null) as DesignProposalState | null;
  const lat = stored?.customer?.mapLat;
  const lng = stored?.customer?.mapLng;
  if (
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    typeof lng === "number" &&
    Number.isFinite(lng)
  ) {
    return `${lat},${lng}`;
  }
  return null;
}

/**
 * A real satellite view of the property, for designs that have no saved
 * solar-step capture of their own (see `designMapScreenshotUrl`) — those are
 * only written once someone completes the panel-layout step, so a design left
 * at DRAFT would otherwise show a generic stock rooftop.
 *
 * Deliberately no marker: the pin would cover the roof this is meant to show.
 * Returns null when there's nothing to centre on, or no key configured, which
 * leaves the caller's own placeholder in place.
 */
export function designStaticMapUrl(design: DesignLike): string | null {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) return null;

  const center = designPin(design) ?? design?.address?.trim();
  if (!center) return null;

  // Same zoom and map type the wizard's location step renders, so the preview
  // frames the roof the way the customer saw it there.
  const params = new URLSearchParams({
    center,
    zoom: String(DESIGNS_LOCATION_STEP.defaultZoom),
    size: SIZE,
    scale: "2",
    maptype: DESIGNS_LOCATION_STEP.mapType,
    key,
  });
  return `${STATIC_MAPS_ENDPOINT}?${params.toString()}`;
}
