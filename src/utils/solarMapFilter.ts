import type { SolarEstimateResult, SolarPanel } from "@/types/solar";

/** Earth radius in meters (WGS84 approximation). */
const R_EARTH_M = 6_371_000;

export function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * R_EARTH_M * Math.asin(Math.min(1, Math.sqrt(s)));
}

function pointInBoundingBox(
  p: { lat: number; lng: number },
  box: SolarEstimateResult["boundingBox"],
): boolean {
  return (
    p.lat >= box.sw.lat &&
    p.lat <= box.ne.lat &&
    p.lng >= box.sw.lng &&
    p.lng <= box.ne.lng
  );
}

/**
 * Keep panels near the user’s map pin (and inside API building bbox when possible).
 * If bbox filtering removes everything, fall back to distance-only so the map never goes blank
 * when the pin sits slightly outside the returned box.
 */
export function filterPanelsForSelectedBuilding(
  panels: SolarPanel[] | undefined,
  selectedLocation: { lat: number; lng: number } | null,
  boundingBox: SolarEstimateResult["boundingBox"] | undefined,
  maxDistanceMeters: number,
): SolarPanel[] {
  if (!panels?.length || !selectedLocation) return panels ?? [];

  const byDistance = panels.filter(
    (p) => haversineMeters(p.center, selectedLocation) <= maxDistanceMeters,
  );

  if (!boundingBox) return byDistance;

  const byBox = byDistance.filter((p) =>
    pointInBoundingBox(p.center, boundingBox),
  );

  if (byBox.length > 0) return byBox;
  return byDistance;
}

/**
 * Roof segments: keep only those whose center is near the pin (and bbox when it helps).
 */
export function filterRoofSegmentsForSelectedBuilding(
  segments: SolarEstimateResult["roofSegments"] | undefined,
  selectedLocation: { lat: number; lng: number } | null,
  boundingBox: SolarEstimateResult["boundingBox"] | undefined,
  maxDistanceMeters: number,
): SolarEstimateResult["roofSegments"] | undefined {
  if (!segments?.length || !selectedLocation) return segments;

  const byDistance = segments.filter(
    (s) => haversineMeters(s.center, selectedLocation) <= maxDistanceMeters,
  );

  if (!boundingBox) return byDistance.length ? byDistance : segments;

  const byBox = byDistance.filter((s) =>
    pointInBoundingBox(s.center, boundingBox),
  );

  if (byBox.length > 0) return byBox;
  return byDistance.length ? byDistance : segments;
}
