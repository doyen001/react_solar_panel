"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, OverlayView, Polygon } from "@react-google-maps/api";
import Icon from "@/components/ui/Icons";
import { useGoogleMaps } from "@/components/providers/GoogleMapsProvider";
import {
  DESIGNS_LOCATION_STEP,
  DESIGNS_SOLAR_PANEL_MAP,
  DESIGNS_SOLAR_PANEL_STEP,
  type DesignsMapLocation,
} from "@/utils/constant";
import {
  filterPanelsForSelectedBuilding,
  filterRoofSegmentsForSelectedBuilding,
  haversineMeters,
} from "@/utils/solarMapFilter";
import { fetchSolarEstimate, useSolarEstimate } from "@/hooks/useSolarEstimate";
import { useSolarLayers, type SolarLayerType } from "@/hooks/useSolarLayers";
import type { GeoTiffOverlay } from "@/utils/geotiff";
import type { SolarEstimateResult, SolarPanel } from "@/types/solar";

const MAP_CONTAINER: React.CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: "525px",
  borderRadius: "25px",
};

const ACTIVE_LAYERS: SolarLayerType[] = ["rgb", "mask"];
function formatNumber(n: number): string {
  return n.toLocaleString("en-AU", { maximumFractionDigits: 0 });
}

/* ── Geo helpers ─────────────────────────────────────────────── */

/**
 * Convert a panel center + dimensions to the four corner lat/lng coords.
 * Panel height runs north/south; width runs east/west.
 */
function panelCorners(
  center: { lat: number; lng: number },
  heightM: number,
  widthM: number,
  orientation: "PORTRAIT" | "LANDSCAPE",
): google.maps.LatLngLiteral[] {
  const metersPerLat = 111320;
  const metersPerLng = 111320 * Math.cos((center.lat * Math.PI) / 180);

  const halfH =
    (orientation === "LANDSCAPE" ? widthM : heightM) / 2 / metersPerLat;
  const halfW =
    (orientation === "LANDSCAPE" ? heightM : widthM) / 2 / metersPerLng;

  return [
    { lat: center.lat + halfH, lng: center.lng - halfW },
    { lat: center.lat + halfH, lng: center.lng + halfW },
    { lat: center.lat - halfH, lng: center.lng + halfW },
    { lat: center.lat - halfH, lng: center.lng - halfW },
  ];
}

type PlanarPoint = { x: number; y: number; lat: number; lng: number };
type PlanarXY = { x: number; y: number };

function toPlanarPoint(
  point: { lat: number; lng: number },
  refLat: number,
): PlanarPoint {
  const scaleX = 111320 * Math.cos((refLat * Math.PI) / 180);
  const scaleY = 111320;
  return {
    x: point.lng * scaleX,
    y: point.lat * scaleY,
    lat: point.lat,
    lng: point.lng,
  };
}

function cross(o: PlanarPoint, a: PlanarPoint, b: PlanarPoint) {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

function planarBounds(points: PlanarXY[]) {
  return points.reduce(
    (bounds, point) => ({
      minX: Math.min(bounds.minX, point.x),
      maxX: Math.max(bounds.maxX, point.x),
      minY: Math.min(bounds.minY, point.y),
      maxY: Math.max(bounds.maxY, point.y),
    }),
    {
      minX: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    },
  );
}

function pointInPolygonPlanar(point: PlanarXY, polygon: PlanarXY[]): boolean {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersects =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi || Number.EPSILON) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function planarToLatLng(point: PlanarXY, refLat: number): google.maps.LatLngLiteral {
  const scaleX = 111320 * Math.cos((refLat * Math.PI) / 180);
  const scaleY = 111320;

  return {
    lat: point.y / scaleY,
    lng: point.x / scaleX,
  };
}

function packPanelsInsideSegments(
  panels: SolarPanel[] | undefined,
  panelDimensions: { heightM: number; widthM: number } | undefined,
): SolarPanel[] | undefined {
  if (!panels?.length || !panelDimensions) {
    return panels;
  }

  const groupedPanels = new Map<number, SolarPanel[]>();
  for (const panel of panels) {
    const group = groupedPanels.get(panel.segmentIndex) ?? [];
    group.push(panel);
    groupedPanels.set(panel.segmentIndex, group);
  }

  const packedPanels: SolarPanel[] = [];

  for (const group of groupedPanels.values()) {
    if (!group.length) continue;

    const avgLat =
      group.reduce((sum, panel) => sum + panel.center.lat, 0) / group.length;
    const polygon = convexHull(
      group
        .flatMap((panel) =>
          panelCorners(
            panel.center,
            panelDimensions.heightM,
            panelDimensions.widthM,
            panel.orientation,
          ),
        )
        .map((point) => toPlanarPoint(point, avgLat)),
    ).map((point) => toPlanarPoint(point, avgLat));

    if (polygon.length < 3) {
      packedPanels.push(...group);
      continue;
    }

    const dominantOrientation =
      group.filter((panel) => panel.orientation === "LANDSCAPE").length >
      group.length / 2
        ? "LANDSCAPE"
        : "PORTRAIT";

    const panelWidthMeters =
      dominantOrientation === "LANDSCAPE"
        ? panelDimensions.heightM
        : panelDimensions.widthM;
    const panelHeightMeters =
      dominantOrientation === "LANDSCAPE"
        ? panelDimensions.widthM
        : panelDimensions.heightM;

    const gapXMeters = 0.08;
    const gapYMeters = 0.08;
    const bounds = planarBounds(polygon);
    const nextGroup: SolarPanel[] = [];

    for (
      let y = bounds.maxY - panelHeightMeters / 2;
      y >= bounds.minY + panelHeightMeters / 2 &&
      nextGroup.length < group.length;
      y -= panelHeightMeters + gapYMeters
    ) {
      for (
        let x = bounds.minX + panelWidthMeters / 2;
        x <= bounds.maxX - panelWidthMeters / 2 &&
        nextGroup.length < group.length;
        x += panelWidthMeters + gapXMeters
      ) {
        const candidateCorners: PlanarXY[] = [
          { x: x - panelWidthMeters / 2, y: y + panelHeightMeters / 2 },
          { x: x + panelWidthMeters / 2, y: y + panelHeightMeters / 2 },
          { x: x + panelWidthMeters / 2, y: y - panelHeightMeters / 2 },
          { x: x - panelWidthMeters / 2, y: y - panelHeightMeters / 2 },
        ];

        if (!candidateCorners.every((corner) => pointInPolygonPlanar(corner, polygon))) {
          continue;
        }

        nextGroup.push({
          ...group[nextGroup.length],
          center: planarToLatLng({ x, y }, avgLat),
          orientation: dominantOrientation,
        });
      }
    }

    packedPanels.push(...nextGroup);
  }

  return packedPanels;
}

function convexHull(points: PlanarPoint[]): google.maps.LatLngLiteral[] {
  if (points.length <= 1) {
    return points.map((point) => ({ lat: point.lat, lng: point.lng }));
  }

  const sorted = [...points].sort((a, b) =>
    a.x === b.x ? a.y - b.y : a.x - b.x,
  );
  const lower: PlanarPoint[] = [];
  for (const point of sorted) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0
    ) {
      lower.pop();
    }
    lower.push(point);
  }

  const upper: PlanarPoint[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const point = sorted[i];
    while (
      upper.length >= 2 &&
      cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0
    ) {
      upper.pop();
    }
    upper.push(point);
  }

  lower.pop();
  upper.pop();

  return [...lower, ...upper].map((point) => ({
    lat: point.lat,
    lng: point.lng,
  }));
}

/* ── Imperative overlay hook ─────────────────────────────────── */

function useImperativeOverlay(
  map: google.maps.Map | null,
  overlay: GeoTiffOverlay | null,
  opacity: number,
  visible: boolean,
) {
  const overlayRef = useRef<google.maps.GroundOverlay | null>(null);

  useEffect(() => {
    overlayRef.current?.setMap(null);
    overlayRef.current = null;

    if (!map || !overlay || !visible) return;

    const { north, south, east, west } = overlay.bounds;
    const bounds = new google.maps.LatLngBounds(
      { lat: south, lng: west },
      { lat: north, lng: east },
    );
    const g = new google.maps.GroundOverlay(overlay.imageUrl, bounds, {
      opacity,
      clickable: false,
    });
    g.setMap(map);
    overlayRef.current = g;

    return () => g.setMap(null);
  }, [map, overlay, opacity, visible]);
}

/* ── Imperative solar panels hook ───────────────────────────── */

function useImperativePanels(
  map: google.maps.Map | null,
  panels: SolarPanel[] | undefined,
  panelDimensions: { heightM: number; widthM: number } | undefined,
  visible: boolean,
) {
  const polygonsRef = useRef<google.maps.Polygon[]>([]);

  useEffect(() => {
    polygonsRef.current.forEach((p) => p.setMap(null));
    polygonsRef.current = [];

    if (!map || !panels?.length || !panelDimensions || !visible) return;

    // Cap at 200 panels to stay performant on large roofs, while keeping
    // multiple selected roofs visible instead of only drawing the first group.
    const subset = balancePanelsAcrossSegments(panels, 200);
    const created: google.maps.Polygon[] = [];

    for (const panel of subset) {
      const polygon = new google.maps.Polygon({
        paths: panelCorners(
          panel.center,
          panelDimensions.heightM,
          panelDimensions.widthM,
          panel.orientation,
        ),
        strokeColor: "#FFF176",
        strokeWeight: 0.8,
        fillColor: "#0B0C0C",
        fillOpacity: 0.82,
        clickable: false,
      });
      polygon.setMap(map);
      created.push(polygon);
    }

    polygonsRef.current = created;

    return () => {
      created.forEach((p) => p.setMap(null));
    };
  }, [map, panels, panelDimensions, visible]);
}

/* ── Imperative roof-segment outline hook ────────────────────── */

function useImperativeRoofSegments(
  map: google.maps.Map | null,
  panels: SolarPanel[] | undefined,
  panelDimensions: { heightM: number; widthM: number } | undefined,
  segments: SolarEstimateResult["roofSegments"] | undefined,
  visible: boolean,
) {
  const polygonsRef = useRef<(google.maps.Rectangle | google.maps.Polygon)[]>(
    [],
  );

  useEffect(() => {
    polygonsRef.current.forEach((shape) => shape.setMap(null));
    polygonsRef.current = [];

    if (!map || !visible) return;

    const created: (google.maps.Rectangle | google.maps.Polygon)[] = [];

    if (panels?.length && panelDimensions) {
      const avgLat =
        panels.reduce((sum, panel) => sum + panel.center.lat, 0) /
        panels.length;
      const groupedPanels = new Map<number, SolarPanel[]>();

      for (const panel of panels) {
        const group = groupedPanels.get(panel.segmentIndex) ?? [];
        group.push(panel);
        groupedPanels.set(panel.segmentIndex, group);
      }

      for (const group of groupedPanels.values()) {
        const footprintPoints = group.flatMap((panel) =>
          panelCorners(
            panel.center,
            panelDimensions.heightM,
            panelDimensions.widthM,
            panel.orientation,
          ),
        );
        const hull = convexHull(
          footprintPoints.map((point) => toPlanarPoint(point, avgLat)),
        );

        if (hull.length >= 3) {
          const polygon = new google.maps.Polygon({
            paths: hull,
            strokeColor: "#00E5FF",
            strokeWeight: 2.5,
            strokeOpacity: 0.95,
            fillColor: "#00E5FF",
            fillOpacity: 0.04,
            clickable: false,
          });
          polygon.setMap(map);
          created.push(polygon);
        }
      }
    } else if (segments?.length) {
      for (const seg of segments) {
        const rect = new google.maps.Rectangle({
          bounds: {
            north: seg.boundingBox.ne.lat,
            south: seg.boundingBox.sw.lat,
            east: seg.boundingBox.ne.lng,
            west: seg.boundingBox.sw.lng,
          },
          strokeColor: "#00E5FF",
          strokeWeight: 2.5,
          strokeOpacity: 0.95,
          fillColor: "#00E5FF",
          fillOpacity: 0.04,
          clickable: false,
        });
        rect.setMap(map);
        created.push(rect);
      }
    }

    polygonsRef.current = created;

    return () => {
      created.forEach((shape) => shape.setMap(null));
    };
  }, [map, panels, panelDimensions, segments, visible]);
}

/* ── Roof-polygon editing helpers ───────────────────────────── */

type RoofPolygon = { id: number; paths: google.maps.LatLngLiteral[] };
type RoofSegment = SolarEstimateResult["roofSegments"][number];

function makeDefaultPolygon(
  center: { lat: number; lng: number },
  offsetDeg = 0,
): google.maps.LatLngLiteral[] {
  const d = 0.00008;
  return [
    { lat: center.lat - d + offsetDeg, lng: center.lng - d + offsetDeg },
    { lat: center.lat + d + offsetDeg, lng: center.lng - d + offsetDeg },
    { lat: center.lat + d + offsetDeg, lng: center.lng + d + offsetDeg },
    { lat: center.lat - d + offsetDeg, lng: center.lng + d + offsetDeg },
  ];
}

function boundingBoxToPolygon(
  box: RoofSegment["boundingBox"],
): google.maps.LatLngLiteral[] {
  return [
    { lat: box.ne.lat, lng: box.sw.lng },
    { lat: box.ne.lat, lng: box.ne.lng },
    { lat: box.sw.lat, lng: box.ne.lng },
    { lat: box.sw.lat, lng: box.sw.lng },
  ];
}

function selectionContainsPoint(
  selectionPaths: google.maps.LatLngLiteral[],
  point: { lat: number; lng: number },
): boolean {
  const selectionPolygon = new google.maps.Polygon({ paths: selectionPaths });
  return google.maps.geometry.poly.containsLocation(
    new google.maps.LatLng(point.lat, point.lng),
    selectionPolygon,
  );
}

function getPolygonRepresentativePoint(paths: google.maps.LatLngLiteral[]): {
  lat: number;
  lng: number;
} {
  const totals = paths.reduce(
    (sum, point) => ({
      lat: sum.lat + point.lat,
      lng: sum.lng + point.lng,
    }),
    { lat: 0, lng: 0 },
  );

  return {
    lat: totals.lat / paths.length,
    lng: totals.lng / paths.length,
  };
}

function getSolarPanelKey(panel: SolarPanel): string {
  return [
    panel.center.lat.toFixed(7),
    panel.center.lng.toFixed(7),
    panel.orientation,
  ].join(":");
}

function dedupeSolarPanels(panels: SolarPanel[]): SolarPanel[] {
  const seen = new Set<string>();
  const unique: SolarPanel[] = [];

  for (const panel of panels) {
    const key = getSolarPanelKey(panel);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(panel);
  }

  return unique;
}

function dedupeNearbyPanels(
  panels: SolarPanel[],
  panelDimensions: { heightM: number; widthM: number } | undefined,
): SolarPanel[] {
  if (!panelDimensions || panels.length <= 1) {
    return dedupeSolarPanels(panels);
  }

  const thresholdMeters =
    Math.min(panelDimensions.widthM, panelDimensions.heightM) * 0.9;
  const unique: SolarPanel[] = [];

  for (const panel of panels) {
    const hasNearbyMatch = unique.some(
      (existing) =>
        existing.orientation === panel.orientation &&
        haversineMeters(existing.center, panel.center) <= thresholdMeters,
    );

    if (!hasNearbyMatch) {
      unique.push(panel);
    }
  }

  return unique;
}

function balancePanelsAcrossSegments(
  panels: SolarPanel[],
  maxPanels: number,
): SolarPanel[] {
  if (panels.length <= maxPanels) {
    return panels;
  }

  const grouped = new Map<number, SolarPanel[]>();
  for (const panel of panels) {
    const group = grouped.get(panel.segmentIndex) ?? [];
    group.push(panel);
    grouped.set(panel.segmentIndex, group);
  }

  const queues = [...grouped.values()];
  const balanced: SolarPanel[] = [];

  while (
    balanced.length < maxPanels &&
    queues.some((queue) => queue.length > 0)
  ) {
    for (const queue of queues) {
      const next = queue.shift();
      if (!next) continue;
      balanced.push(next);
      if (balanced.length >= maxPanels) break;
    }
  }

  return balanced;
}

function panelIntersectsRoofSelection(
  panel: SolarPanel,
  selectionPaths: google.maps.LatLngLiteral[],
  panelDimensions: { heightM: number; widthM: number } | undefined,
): boolean {
  const selectionPolygon = new google.maps.Polygon({ paths: selectionPaths });
  const panelCenter = new google.maps.LatLng(
    panel.center.lat,
    panel.center.lng,
  );

  if (
    google.maps.geometry.poly.containsLocation(panelCenter, selectionPolygon)
  ) {
    return true;
  }

  if (!panelDimensions) {
    return false;
  }

  const corners = panelCorners(
    panel.center,
    panelDimensions.heightM,
    panelDimensions.widthM,
    panel.orientation,
  );

  return corners.some((corner) =>
    google.maps.geometry.poly.containsLocation(
      new google.maps.LatLng(corner.lat, corner.lng),
      selectionPolygon,
    ),
  );
}

/* ── Main component ──────────────────────────────────────────── */

type ActiveLayer = "all" | "satellite" | "panels";

type DesignsSolarPanelStepContentProps = {
  selectedLocation: DesignsMapLocation | null;
};

export function DesignsSolarPanelStepContent({
  selectedLocation,
}: DesignsSolarPanelStepContentProps) {
  const { isLoaded } = useGoogleMaps();

  const [mapReady, setMapReady] = useState<google.maps.Map | null>(null);
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>("all");

  /* ── Roof polygon editing state ── */
  const [isEditing, setIsEditing] = useState(false);
  const roofCounter = useRef(0);
  const [editingRoofs, setEditingRoofs] = useState<RoofPolygon[]>([]);
  const [savedRoofs, setSavedRoofs] = useState<google.maps.LatLngLiteral[][]>(
    [],
  );
  const polygonRefs = useRef<Map<number, google.maps.Polygon>>(new Map());
  const [polygonFilteredPanels, setPolygonFilteredPanels] = useState<
    SolarPanel[] | null
  >(null);
  const [polygonTotalAreaM2, setPolygonTotalAreaM2] = useState<number | null>(
    null,
  );
  const [isSavingSelection, setIsSavingSelection] = useState(false);

  const { data, loading, error, retry } = useSolarEstimate(selectedLocation);

  const filteredPanels = useMemo(
    () =>
      dedupeNearbyPanels(
        filterPanelsForSelectedBuilding(
          data?.solarPanels,
          selectedLocation,
          data?.boundingBox,
          DESIGNS_SOLAR_PANEL_MAP.maxPanelDistanceFromPinMeters,
        ),
        data?.panelDimensions,
      ),
    [
      data?.solarPanels,
      data?.boundingBox,
      data?.panelDimensions,
      selectedLocation,
    ],
  );

  const filteredRoofSegments = useMemo(
    () =>
      filterRoofSegmentsForSelectedBuilding(
        data?.roofSegments,
        selectedLocation,
        data?.boundingBox,
        DESIGNS_SOLAR_PANEL_MAP.maxPanelDistanceFromPinMeters,
      ),
    [data?.roofSegments, data?.boundingBox, selectedLocation],
  );

  /* Reset polygon selection when address changes (derived-state pattern, avoids effect) */
  const [prevSelectedLocation, setPrevSelectedLocation] =
    useState(selectedLocation);
  if (prevSelectedLocation !== selectedLocation) {
    setPrevSelectedLocation(selectedLocation);
    setPolygonFilteredPanels(null);
    setSavedRoofs([]);
    setPolygonTotalAreaM2(null);
    setIsEditing(false);
    setEditingRoofs([]);
  }

  /* Active panels: polygon-selection override or full AI-detected set */
  const activePanels = polygonFilteredPanels ?? filteredPanels;

  const availablePanelLimit = useMemo(() => {
    if (polygonFilteredPanels !== null) return polygonFilteredPanels.length;
    if (activePanels.length > 0) return activePanels.length;
    return data?.maxPanelsCount ?? 0;
  }, [data?.maxPanelsCount, activePanels.length, polygonFilteredPanels]);

  const [panelCountInput, setPanelCountInput] = useState("");

  const selectedPanelCount = useMemo(() => {
    const parsed = Number.parseInt(panelCountInput, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return availablePanelLimit;
    return Math.min(parsed, availablePanelLimit);
  }, [availablePanelLimit, panelCountInput]);

  const visiblePanels = useMemo(
    () => activePanels.slice(0, selectedPanelCount),
    [activePanels, selectedPanelCount],
  );

  const renderedPanels = useMemo(
    () => packPanelsInsideSegments(visiblePanels, data?.panelDimensions),
    [data?.panelDimensions, visiblePanels],
  );

  const panelCountDisplayValue = useMemo(() => {
    if (!availablePanelLimit) return "";
    const parsed = Number.parseInt(panelCountInput, 10);
    if (!Number.isFinite(parsed) || parsed <= 0)
      return String(availablePanelLimit);
    return String(Math.min(parsed, availablePanelLimit));
  }, [availablePanelLimit, panelCountInput]);

  /* ── Edit / Save handlers ── */

  const handleEditClick = useCallback(() => {
    if (!selectedLocation) return;
    setIsEditing(true);
    if (savedRoofs.length > 0) {
      setEditingRoofs(
        savedRoofs.map((paths) => ({ id: ++roofCounter.current, paths })),
      );
    } else {
      setEditingRoofs([
        {
          id: ++roofCounter.current,
          paths: makeDefaultPolygon(selectedLocation),
        },
      ]);
    }
  }, [selectedLocation, savedRoofs]);

  const getCurrentEditingPaths = useCallback(() => {
    return editingRoofs.map((roof) => {
      const ref = polygonRefs.current.get(roof.id);
      if (!ref) return roof.paths;
      return ref
        .getPath()
        .getArray()
        .map((p) => ({ lat: p.lat(), lng: p.lng() }));
    });
  }, [editingRoofs]);

  const handleAddRoof = useCallback(() => {
    if (!selectedLocation) return;

    const currentPaths = getCurrentEditingPaths();
    const nextRoofSegment = (data?.roofSegments ?? []).find(
      (segment) =>
        !currentPaths.some((paths) =>
          selectionContainsPoint(paths, segment.center),
        ),
    );

    setEditingRoofs((prev) => [
      ...prev,
      {
        id: ++roofCounter.current,
        paths: nextRoofSegment
          ? boundingBoxToPolygon(nextRoofSegment.boundingBox)
          : makeDefaultPolygon(selectedLocation, prev.length * 0.0002),
      },
    ]);
  }, [data?.roofSegments, getCurrentEditingPaths, selectedLocation]);

  const handleSave = useCallback(async () => {
    /* Read final paths from imperative polygon refs (user may have dragged vertices) */
    const currentPaths = getCurrentEditingPaths();
    const validPaths = currentPaths.filter((p) => p.length >= 3);
    setSavedRoofs(validPaths);

    if (validPaths.length === 0) {
      setPolygonFilteredPanels(null);
      setPolygonTotalAreaM2(null);
      polygonRefs.current.clear();
      setIsEditing(false);
      setEditingRoofs([]);
      return;
    }

    let totalArea = 0;
    for (const path of validPaths) {
      totalArea += google.maps.geometry.spherical.computeArea(
        path.map((p) => new google.maps.LatLng(p.lat, p.lng)),
      );
    }
    setPolygonTotalAreaM2(totalArea);

    setIsSavingSelection(true);

    try {
      const extraEstimates = await Promise.allSettled(
        validPaths.map((path) => {
          const point = getPolygonRepresentativePoint(path);
          return fetchSolarEstimate(point.lat, point.lng);
        }),
      );

      const mergedPanels = dedupeNearbyPanels(
        [
          ...(data?.solarPanels ?? []),
          ...extraEstimates.flatMap((result, index) => {
            if (result.status !== "fulfilled") return [];

            const segmentOffset = (index + 1) * 10_000;
            return result.value.solarPanels.map((panel) => ({
              ...panel,
              segmentIndex: panel.segmentIndex + segmentOffset,
            }));
          }),
        ],
        data?.panelDimensions,
      );

      const inside = dedupeNearbyPanels(
        mergedPanels.filter((panel) =>
          validPaths.some((path) =>
            panelIntersectsRoofSelection(panel, path, data?.panelDimensions),
          ),
        ),
        data?.panelDimensions,
      );
      setPolygonFilteredPanels(inside);
    } finally {
      setIsSavingSelection(false);
    }

    polygonRefs.current.clear();
    setIsEditing(false);
    setEditingRoofs([]);
  }, [data?.panelDimensions, data?.solarPanels, getCurrentEditingPaths]);

  const {
    rgb: rgbOverlay,
    mask: maskOverlay,
    loading: layersLoading,
    error: layersError,
    retry: layersRetry,
  } = useSolarLayers(selectedLocation, ACTIVE_LAYERS);

  const mapCenter = selectedLocation ?? DESIGNS_LOCATION_STEP.defaultCenter;
  const mapZoom = selectedLocation ? DESIGNS_LOCATION_STEP.defaultZoom : 14;

  const onMapLoad = useCallback((map: google.maps.Map) => {
    map.setTilt(0);
    map.setHeading(0);
    setMapReady(map);
  }, []);

  /* layer visibility */
  const showSolarRgb = activeLayer === "all" || activeLayer === "satellite";
  const showPanels = activeLayer === "all" || activeLayer === "panels";

  /* GeoTIFF imagery overlays */
  useImperativeOverlay(mapReady, rgbOverlay, 0.92, showSolarRgb);
  useImperativeOverlay(mapReady, maskOverlay, 0.45, showSolarRgb);

  /* Solar panels + roof segment outlines */
  useImperativePanels(
    mapReady,
    renderedPanels,
    data?.panelDimensions,
    showPanels,
  );
  useImperativeRoofSegments(
    mapReady,
    activePanels,
    data?.panelDimensions,
    filteredRoofSegments,
    showPanels,
  );

  /* Left panel metric rows */
  const metrics = useMemo(
    () =>
      DESIGNS_SOLAR_PANEL_STEP.metrics.map((metric) => {
        if (!data) return { ...metric, value: "—" };

        if (metric.id === "total-roof-area") {
          const area = polygonTotalAreaM2 ?? data.wholeRoofAreaM2;
          return { ...metric, value: `${formatNumber(area)} m²` };
        }

        if (metric.id === "usable-roof-area") {
          if (polygonTotalAreaM2 !== null && data.panelDimensions) {
            /* Usable = panels in selection × individual panel footprint */
            const panelArea =
              data.panelDimensions.heightM * data.panelDimensions.widthM;
            const usable = (polygonFilteredPanels?.length ?? 0) * panelArea;
            return { ...metric, value: `${formatNumber(usable)} m²` };
          }
          return {
            ...metric,
            value: `${formatNumber(data.maxArrayAreaM2)} m²`,
          };
        }

        /* panels-fit */
        if (polygonFilteredPanels !== null) {
          return { ...metric, value: String(polygonFilteredPanels.length) };
        }
        return { ...metric, value: String(data.maxPanelsCount) };
      }),
    [data, polygonTotalAreaM2, polygonFilteredPanels],
  );

  const combinedError = error ?? layersError;
  const combinedRetry = () => {
    if (error) retry();
    if (layersError) layersRetry();
  };

  void combinedError;
  void combinedRetry;

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-1 flex-col px-4 pt-8 sm:px-8 sm:pt-10 lg:px-[81px] lg:pt-[37px]">
      <div className="flex w-full max-w-[1278px] flex-1 flex-col items-center justify-center gap-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-[58px]">
        {/* ── Left panel ── */}
        <div className="flex min-h-[525px] w-full max-w-[591px] shrink-0 items-center rounded-[46px] border-[3px] border-design-accent-cyan bg-linear-to-r from-yellow-lemon to-orange-amber px-8 py-12 shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] sm:px-10 lg:px-[46px] lg:py-[56px]">
          <div className="mx-auto flex w-full max-w-[514px] flex-col items-center gap-[32px]">
            {/* Title + description */}
            <div className="flex max-w-[498px] flex-col items-center gap-[10px] text-center">
              <h2
                className="w-full font-source-sans text-[clamp(28px,4.8vw,40px)] font-bold capitalize leading-[1.05] text-white"
                style={{ letterSpacing: "0.248px" }}
              >
                {DESIGNS_SOLAR_PANEL_STEP.title}
              </h2>
              <div
                className="font-source-sans text-[clamp(18px,2.4vw,22px)] font-normal capitalize leading-[1.35] text-black"
                style={{ letterSpacing: "0.248px" }}
              >
                {DESIGNS_SOLAR_PANEL_STEP.descriptionLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            {/* Metric rows */}
            <div className="flex w-full flex-col gap-[10px]">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="flex h-[56px] items-center justify-between rounded-[12px] border-2 border-yellow-lemon bg-white px-[12px] pl-[14px]"
                >
                  <span className="font-inter text-[14px] font-normal tracking-[-0.1504px] text-ink">
                    {metric.label}
                  </span>

                  {metric.id === "panels-fit" ? (
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={loading ? "" : panelCountDisplayValue}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, "");
                        if (!digitsOnly) {
                          setPanelCountInput("");
                          return;
                        }
                        const nextValue = availablePanelLimit
                          ? Math.min(
                              Number.parseInt(digitsOnly, 10),
                              availablePanelLimit,
                            )
                          : Number.parseInt(digitsOnly, 10);
                        setPanelCountInput(String(nextValue));
                      }}
                      disabled={loading || !availablePanelLimit}
                      aria-label={metric.label}
                      className="h-[36px] w-[92px] rounded-[6px] bg-[#FDE047] px-[12px] text-center font-inter text-[14px] font-semibold tracking-[-0.1504px] text-ink shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] outline-none disabled:cursor-not-allowed disabled:opacity-70"
                    />
                  ) : (
                    <span className="rounded-[6px] bg-[#FDE047] px-[14px] py-[8px] font-inter text-[14px] font-semibold tracking-[-0.1504px] text-ink shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)]">
                      {loading ? "..." : metric.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {data?.estimated && (
              <p className="w-full rounded-[10px] bg-white/70 px-4 py-2 text-center font-inter text-[12px] font-medium text-ink/70">
                Google Solar imagery is not available for this location yet.
                These values are estimates based on typical Australian rooftops.
              </p>
            )}

            {(loading || layersLoading || isSavingSelection) && (
              <p className="animate-pulse font-inter text-[14px] font-medium text-white/80">
                {isSavingSelection
                  ? "Finding solar panels for selected roofs..."
                  : layersLoading
                    ? "Loading roof imagery..."
                    : "Analysing solar potential..."}
              </p>
            )}
          </div>
        </div>

        {/* ── Right panel: map ── */}
        <div className="w-full max-w-[649px] shrink-0 overflow-hidden rounded-[28px] border-[3px] border-design-accent-cyan shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)]">
          <div className="relative min-h-[525px] w-full h-full overflow-hidden rounded-[25px]">
            {isLoaded ? (
              <>
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER}
                  center={mapCenter}
                  zoom={mapZoom}
                  onLoad={onMapLoad}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    mapTypeId: "satellite",
                    tilt: 0,
                    rotateControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                  }}
                >
                  {selectedLocation && (
                    <OverlayView
                      position={selectedLocation}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      getPixelPositionOffset={(width, height) => ({
                        x: -(width / 2),
                        y: -height,
                      })}
                    >
                      <div className="pointer-events-none flex flex-col items-center">
                        <Icon
                          name="LocationPin"
                          className="size-[36px] text-[#FF3B30] drop-shadow-[0px_4px_10px_rgba(0,0,0,0.32)]"
                        />
                      </div>
                    </OverlayView>
                  )}

                  {/* Editable roof polygons (edit mode) */}
                  {isEditing &&
                    editingRoofs.map((roof) => (
                      <Polygon
                        key={roof.id}
                        paths={roof.paths}
                        options={{
                          fillColor: "#51FF00",
                          fillOpacity: 0.18,
                          strokeColor: "#51FF00",
                          strokeOpacity: 0.9,
                          strokeWeight: 2.5,
                          clickable: true,
                          zIndex: 10,
                        }}
                        draggable
                        editable
                        onLoad={(polygon) => {
                          polygonRefs.current.set(roof.id, polygon);
                        }}
                        onUnmount={() => {
                          polygonRefs.current.delete(roof.id);
                        }}
                      />
                    ))}

                  {/* Saved roof outlines (view mode) */}
                  {!isEditing &&
                    savedRoofs.map((paths, idx) => (
                      <Polygon
                        key={`saved-${idx}`}
                        paths={paths}
                        options={{
                          fillColor: "#22c55e",
                          fillOpacity: 0.1,
                          strokeColor: "#22c55e",
                          strokeOpacity: 0.85,
                          strokeWeight: 2,
                          clickable: false,
                          zIndex: 5,
                        }}
                      />
                    ))}
                </GoogleMap>
              </>
            ) : (
              <div className="flex h-full min-h-[525px] items-center justify-center rounded-[25px] bg-[linear-gradient(135deg,rgba(48,54,71,0.98)_0%,rgba(33,36,47,0.98)_100%)]">
                <p className="px-8 text-center font-source-sans text-[20px] font-medium text-white/60">
                  Loading map...
                </p>
              </div>
            )}

            {/* Top-right controls */}
            <div className="absolute right-[14px] top-[14px] flex items-center gap-[8px]">
              <LayerToggle active={activeLayer} onChange={setActiveLayer} />
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleAddRoof}
                    disabled={isSavingSelection}
                    className="h-[33px] rounded-[6px] bg-white/90 px-[14px] font-inter text-[13px] font-semibold tracking-[-0.1504px] text-[#2094F3] shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] transition hover:bg-white"
                  >
                    + Add New Roof
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSavingSelection}
                    className="h-[33px] rounded-[6px] bg-[linear-gradient(126deg,#22c55e_0%,#16a34a_100%)] px-[18px] font-inter text-[13px] font-semibold tracking-[-0.1504px] text-white shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] disabled:opacity-60"
                  >
                    {isSavingSelection ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEditClick}
                  disabled={!selectedLocation}
                  className="h-[33px] rounded-[6px] bg-[linear-gradient(126deg,#2094F3_0%,#17CFCF_100%)] px-[18px] font-inter text-[13px] font-semibold tracking-[-0.1504px] text-white shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] disabled:opacity-50"
                >
                  {DESIGNS_SOLAR_PANEL_STEP.mapActions.primary}
                </button>
              )}
            </div>

            {/* Edit mode instruction hint */}
            {isEditing && (
              <div className="pointer-events-none absolute bottom-[14px] left-1/2 -translate-x-1/2">
                <p className="whitespace-nowrap rounded-[8px] bg-black/60 px-4 py-2 font-inter text-[12px] font-medium text-white backdrop-blur-sm">
                  Drag vertices to reshape · Drag the polygon to move it
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

function LayerToggle({
  active,
  onChange,
}: {
  active: ActiveLayer;
  onChange: (v: ActiveLayer) => void;
}) {
  const options: { value: ActiveLayer; label: string }[] = [
    { value: "all", label: "All" },
    { value: "satellite", label: "RGB" },
    { value: "panels", label: "Panels" },
  ];

  return (
    <div className="flex overflow-hidden rounded-[6px] shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)]">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`h-[33px] px-[11px] font-inter text-[12px] font-semibold tracking-[-0.1px] transition ${
            active === opt.value
              ? "bg-white text-[#2094F3]"
              : "bg-white/60 text-[#333] hover:bg-white/80"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
