"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, OverlayView, Polygon } from "@react-google-maps/api";
import Icon from "@/components/ui/Icons";
import { useGoogleMaps } from "@/components/providers/GoogleMapsProvider";
import {
  DESIGNS_LOCATION_STEP,
  DESIGNS_SOLAR_PANEL_STEP,
  type DesignsMapLocation,
} from "@/utils/constant";
import { useSolarEstimate } from "@/hooks/useSolarEstimate";
import { useSolarLayers, type SolarLayerType } from "@/hooks/useSolarLayers";
import type { GeoTiffOverlay } from "@/utils/geotiff";
import { extractRoofOutlineFromMask } from "@/utils/roofMaskContour";
import type { SolarEstimateResult, SolarPanel } from "@/types/solar";

const MAP_CONTAINER: React.CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: "525px",
  borderRadius: "25px",
};

const ACTIVE_LAYERS: SolarLayerType[] = ["rgb", "mask"];

/** Hard cap on Google Maps Polygon instances for generated panels (perf). Keep ≥ typical “panels that fit” so the map matches the left-panel count. */
const MAX_MAP_SOLAR_PANEL_POLYGONS = 1500;
function formatNumber(n: number): string {
  return n.toLocaleString("en-AU", { maximumFractionDigits: 0 });
}

/* ── Geo helpers ─────────────────────────────────────────────── */

/**
 * Convert a panel center + dimensions to the four corner lat/lng coords.
 * Rotation is measured in planar degrees from the east axis counter-clockwise.
 */
function panelCorners(
  center: { lat: number; lng: number },
  heightM: number,
  widthM: number,
  orientation: "PORTRAIT" | "LANDSCAPE",
  rotationDegrees = 0,
): google.maps.LatLngLiteral[] {
  const metersPerLat = 111320;
  const metersPerLng = 111320 * Math.cos((center.lat * Math.PI) / 180);

  const halfHeightMeters = (orientation === "LANDSCAPE" ? widthM : heightM) / 2;
  const halfWidthMeters = (orientation === "LANDSCAPE" ? heightM : widthM) / 2;
  const angle = (rotationDegrees * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return [
    { x: -halfWidthMeters, y: halfHeightMeters },
    { x: halfWidthMeters, y: halfHeightMeters },
    { x: halfWidthMeters, y: -halfHeightMeters },
    { x: -halfWidthMeters, y: -halfHeightMeters },
  ].map((point) => {
    const rotatedX = point.x * cos - point.y * sin;
    const rotatedY = point.x * sin + point.y * cos;
    return {
      lat: center.lat + rotatedY / metersPerLat,
      lng: center.lng + rotatedX / metersPerLng,
    };
  });
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

function planarToLatLng(
  point: PlanarXY,
  refLat: number,
): google.maps.LatLngLiteral {
  const scaleX = 111320 * Math.cos((refLat * Math.PI) / 180);
  const scaleY = 111320;

  return {
    lat: point.y / scaleY,
    lng: point.x / scaleX,
  };
}

function centroidPlanar(points: PlanarXY[]): PlanarXY {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function rotatePlanarPoint(
  point: PlanarXY,
  center: PlanarXY,
  angleRadians: number,
): PlanarXY {
  const cos = Math.cos(angleRadians);
  const sin = Math.sin(angleRadians);
  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

/**
 * Angle (degrees) of the longest edge of the polygon in planar metre space.
 */
function longestEdgeAngleDegrees(polygon: google.maps.LatLngLiteral[]): number {
  if (polygon.length < 2) return 0;
  const avgLat = polygon.reduce((s, p) => s + p.lat, 0) / polygon.length;
  let best = 0;
  let bestLen = 0;
  for (let i = 0; i < polygon.length; i++) {
    const a = toPlanarPoint(polygon[i], avgLat);
    const b = toPlanarPoint(polygon[(i + 1) % polygon.length], avgLat);
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len > bestLen) {
      bestLen = len;
      best = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    }
  }
  return best;
}

/**
 * Compute X-spans of the polygon at a given scanline Y by intersecting every
 * edge.  Returns sorted pairs {left, right}. For concave polygons there may
 * be more than one span per row.
 */
function polygonXSpansAtY(
  polygon: PlanarXY[],
  y: number,
): { left: number; right: number }[] {
  const xs: number[] = [];
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const yi = polygon[i].y;
    const yj = polygon[j].y;
    if ((yi <= y && yj > y) || (yj <= y && yi > y)) {
      const t = (y - yi) / (yj - yi);
      xs.push(polygon[i].x + t * (polygon[j].x - polygon[i].x));
    }
  }
  xs.sort((a, b) => a - b);
  const spans: { left: number; right: number }[] = [];
  for (let k = 0; k + 1 < xs.length; k += 2) {
    spans.push({ left: xs[k], right: xs[k + 1] });
  }
  return spans;
}

function generatePanelsForRoofPolygon(
  polygon: google.maps.LatLngLiteral[],
  panelDimensions: { heightM: number; widthM: number },
  segmentIndex: number,
): SolarPanel[] {
  if (polygon.length < 3) return [];

  const avgLat = polygon.reduce((s, p) => s + p.lat, 0) / polygon.length;
  const polygonXY = polygon.map((p) => {
    const pp = toPlanarPoint(p, avgLat);
    return { x: pp.x, y: pp.y };
  });
  const centroid = centroidPlanar(polygonXY);

  const rowAngleDeg = longestEdgeAngleDegrees(polygon);
  const rowAngleRad = (rowAngleDeg * Math.PI) / 180;

  const rotPoly = polygonXY.map((p) =>
    rotatePlanarPoint(p, centroid, -rowAngleRad),
  );
  const bounds = planarBounds(rotPoly);

  const gapM = 0.08;
  const ROW_OFFSET_SAMPLES = 12;

  const panelW = (landscape: boolean) =>
    landscape
      ? Math.max(panelDimensions.heightM, panelDimensions.widthM)
      : Math.min(panelDimensions.heightM, panelDimensions.widthM);

  const panelH = (landscape: boolean) =>
    landscape
      ? Math.min(panelDimensions.heightM, panelDimensions.widthM)
      : Math.max(panelDimensions.heightM, panelDimensions.widthM);

  const toSolarPanel = (
    x: number,
    y: number,
    orientation: "PORTRAIT" | "LANDSCAPE",
  ): SolarPanel => {
    const center = rotatePlanarPoint({ x, y }, centroid, rowAngleRad);
    return {
      center: planarToLatLng(center, avgLat),
      orientation,
      rotationDegrees: rowAngleDeg,
      segmentIndex,
      yearlyEnergyDcKwh: 0,
    };
  };

  /**
   * For a row centred at height `y`, compute the *usable* X-spans by
   * intersecting the polygon at the panel's top and bottom edges, then
   * greedily pack panels left-to-right within each span:
   *  1. The first panel is placed flush against the left boundary.
   *  2. Each subsequent panel starts at (previous panel right edge + gap).
   *  3. A panel is placed only when the remaining distance to the right
   *     boundary >= panelWidth, guaranteeing no overlap with the border.
   */
  const fillRow = (
    y: number,
    pw: number,
    ph: number,
    orientation: "PORTRAIT" | "LANDSCAPE",
  ): SolarPanel[] => {
    const halfH = ph / 2;
    const topSpans = polygonXSpansAtY(rotPoly, y + halfH);
    const botSpans = polygonXSpansAtY(rotPoly, y - halfH);

    const usableSpans: { left: number; right: number }[] = [];
    for (const top of topSpans) {
      for (const bot of botSpans) {
        const left = Math.max(top.left, bot.left);
        const right = Math.min(top.right, bot.right);
        if (right - left >= pw) {
          usableSpans.push({ left, right });
        }
      }
    }

    const panels: SolarPanel[] = [];
    for (const span of usableSpans) {
      let x = span.left + pw / 2;
      while (x + pw / 2 <= span.right + 1e-6) {
        panels.push(toSolarPanel(x, y, orientation));
        x += pw + gapM;
      }
    }
    return panels;
  };

  let bestPanels: SolarPanel[] = [];

  for (const isLandscape of [true, false]) {
    const pw = panelW(isLandscape);
    const ph = panelH(isLandscape);
    const orientation: "PORTRAIT" | "LANDSCAPE" = isLandscape
      ? "LANDSCAPE"
      : "PORTRAIT";
    const yStep = ph + gapM;

    for (let s = 0; s < ROW_OFFSET_SAMPLES; s++) {
      const yOffset = (s / ROW_OFFSET_SAMPLES) * yStep;
      const generated: SolarPanel[] = [];

      for (
        let y = bounds.minY + ph / 2 + yOffset;
        y + ph / 2 <= bounds.maxY + 1e-6;
        y += yStep
      ) {
        generated.push(...fillRow(y, pw, ph, orientation));
      }

      if (generated.length > bestPanels.length) {
        bestPanels = generated;
      }
    }
  }

  return bestPanels;
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

    const subset = balancePanelsAcrossSegments(
      panels,
      MAX_MAP_SOLAR_PANEL_POLYGONS,
    );
    const created: google.maps.Polygon[] = [];

    for (const panel of subset) {
      const polygon = new google.maps.Polygon({
        paths: panelCorners(
          panel.center,
          panelDimensions.heightM,
          panelDimensions.widthM,
          panel.orientation,
          panel.rotationDegrees,
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

/**
 * Roof outline: traced polygon from Solar roof-mask GeoTIFF (true footprint),
 * else rectangle from Building Insights `boundingBox`.
 */
function useImperativeRoofOutline(
  map: google.maps.Map | null,
  maskOutline: google.maps.LatLngLiteral[] | null,
  buildingBoundingBox: SolarEstimateResult["boundingBox"] | undefined,
  visible: boolean,
) {
  const overlayRef = useRef<google.maps.Rectangle | google.maps.Polygon | null>(
    null,
  );

  useEffect(() => {
    overlayRef.current?.setMap(null);
    overlayRef.current = null;

    if (!map || !visible) return;

    const opts = {
      strokeColor: "#00E5FF",
      strokeWeight: 2.5,
      strokeOpacity: 0.95,
      fillColor: "#00E5FF",
      fillOpacity: 0.04,
      clickable: false,
    } as const;

    if (maskOutline && maskOutline.length >= 3) {
      const poly = new google.maps.Polygon({
        paths: maskOutline,
        ...opts,
      });
      poly.setMap(map);
      overlayRef.current = poly;
      return () => poly.setMap(null);
    }

    if (buildingBoundingBox) {
      const rect = new google.maps.Rectangle({
        bounds: {
          north: buildingBoundingBox.ne.lat,
          south: buildingBoundingBox.sw.lat,
          east: buildingBoundingBox.ne.lng,
          west: buildingBoundingBox.sw.lng,
        },
        ...opts,
      });
      rect.setMap(map);
      overlayRef.current = rect;
      return () => rect.setMap(null);
    }
  }, [map, maskOutline, buildingBoundingBox, visible]);
}

/* ── Roof-polygon editing helpers ───────────────────────────── */

type RoofPolygon = { id: number; paths: google.maps.LatLngLiteral[] };

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
  box: SolarEstimateResult["boundingBox"],
): google.maps.LatLngLiteral[] {
  return [
    { lat: box.ne.lat, lng: box.sw.lng },
    { lat: box.ne.lat, lng: box.ne.lng },
    { lat: box.sw.lat, lng: box.ne.lng },
    { lat: box.sw.lat, lng: box.sw.lng },
  ];
}

/** Dedupe key must include roof segment so nearby/overlapping polygons do not steal each other's panels. */
function getSolarPanelKey(panel: SolarPanel): string {
  return [
    panel.segmentIndex,
    panel.center.lat.toFixed(7),
    panel.center.lng.toFixed(7),
    panel.orientation,
    (panel.rotationDegrees ?? 0).toFixed(2),
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

/* ── Main component ──────────────────────────────────────────── */

type ActiveLayer = "satellite" | "panels";

type DesignsSolarPanelStepContentProps = {
  selectedLocation: DesignsMapLocation | null;
};

export function DesignsSolarPanelStepContent({
  selectedLocation,
}: DesignsSolarPanelStepContentProps) {
  const { isLoaded } = useGoogleMaps();

  const [mapReady, setMapReady] = useState<google.maps.Map | null>(null);
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>("panels");

  /* ── Roof polygon editing state ── */
  const [isEditing, setIsEditing] = useState(false);
  const roofCounter = useRef(0);
  const [editingRoofs, setEditingRoofs] = useState<RoofPolygon[]>([]);
  const [savedRoofs, setSavedRoofs] = useState<google.maps.LatLngLiteral[][]>(
    [],
  );
  const polygonRefs = useRef<Map<number, google.maps.Polygon>>(new Map());
  const [generatedPanels, setGeneratedPanels] = useState<SolarPanel[] | null>(
    null,
  );
  const [polygonTotalAreaM2, setPolygonTotalAreaM2] = useState<number | null>(
    null,
  );
  const [isGeneratingPanels, setIsGeneratingPanels] = useState(false);
  const [hasInitializedRoof, setHasInitializedRoof] = useState(false);

  const { data, loading, error, retry } = useSolarEstimate(selectedLocation);
  const {
    rgb: rgbOverlay,
    mask: maskOverlay,
    loading: layersLoading,
    error: layersError,
    retry: layersRetry,
  } = useSolarLayers(selectedLocation, ACTIVE_LAYERS);

  const maskRaster = maskOverlay?.raster ?? null;

  const roofMaskOutline = useMemo(() => {
    if (!maskRaster || !selectedLocation) return null;
    return extractRoofOutlineFromMask(
      maskRaster,
      selectedLocation.lat,
      selectedLocation.lng,
    );
  }, [maskRaster, selectedLocation]);

  const initialRoofPolygon = useMemo(() => {
    if (!selectedLocation) return null;
    if (roofMaskOutline?.length) return roofMaskOutline;
    if (data?.boundingBox) return boundingBoxToPolygon(data.boundingBox);
    if (loading || layersLoading) return null;
    return makeDefaultPolygon(selectedLocation);
  }, [
    data?.boundingBox,
    layersLoading,
    loading,
    roofMaskOutline,
    selectedLocation,
  ]);

  /* Reset polygon selection when address changes (derived-state pattern, avoids effect) */
  const [prevSelectedLocation, setPrevSelectedLocation] =
    useState(selectedLocation);
  if (prevSelectedLocation !== selectedLocation) {
    setPrevSelectedLocation(selectedLocation);
    setGeneratedPanels(null);
    setSavedRoofs([]);
    setPolygonTotalAreaM2(null);
    setIsEditing(false);
    setEditingRoofs([]);
    setHasInitializedRoof(false);
  }

  useEffect(() => {
    if (!selectedLocation || hasInitializedRoof || !initialRoofPolygon) {
      return;
    }

    setEditingRoofs([
      {
        id: ++roofCounter.current,
        paths: initialRoofPolygon,
      },
    ]);
    setIsEditing(true);
    setHasInitializedRoof(true);
  }, [hasInitializedRoof, initialRoofPolygon, selectedLocation]);

  const availablePanelLimit = useMemo(() => {
    return generatedPanels?.length ?? 0;
  }, [generatedPanels]);

  const [panelCountInput, setPanelCountInput] = useState("");

  const selectedPanelCount = useMemo(() => {
    const parsed = Number.parseInt(panelCountInput, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return availablePanelLimit;
    return Math.min(parsed, availablePanelLimit);
  }, [availablePanelLimit, panelCountInput]);

  const visiblePanels = useMemo(
    () => (generatedPanels ?? []).slice(0, selectedPanelCount),
    [generatedPanels, selectedPanelCount],
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
          paths:
            roofMaskOutline ??
            (data?.boundingBox
              ? boundingBoxToPolygon(data.boundingBox)
              : makeDefaultPolygon(selectedLocation)),
        },
      ]);
    }
  }, [data?.boundingBox, roofMaskOutline, savedRoofs, selectedLocation]);

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

    setEditingRoofs((prev) => [
      ...prev,
      {
        id: ++roofCounter.current,
        paths:
          roofMaskOutline ??
          (data?.boundingBox
            ? boundingBoxToPolygon(data.boundingBox)
            : makeDefaultPolygon(selectedLocation, prev.length * 0.0002)),
      },
    ]);
  }, [data?.boundingBox, roofMaskOutline, selectedLocation]);

  const handleSave = useCallback(() => {
    /* Read final paths from imperative polygon refs (user may have dragged vertices) */
    const currentPaths = getCurrentEditingPaths();
    const validPaths = currentPaths.filter((p) => p.length >= 3);
    setSavedRoofs(validPaths);

    if (validPaths.length === 0) {
      setGeneratedPanels(null);
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

    setIsGeneratingPanels(true);
    try {
      if (data?.panelDimensions) {
        const nextPanels = dedupeSolarPanels(
          validPaths.flatMap((roof, index) =>
            generatePanelsForRoofPolygon(roof, data.panelDimensions, index),
          ),
        );
        setGeneratedPanels(nextPanels);
      } else {
        setGeneratedPanels(null);
      }
    } finally {
      setIsGeneratingPanels(false);
    }

    polygonRefs.current.clear();
    setIsEditing(false);
    setEditingRoofs([]);
  }, [data?.panelDimensions, getCurrentEditingPaths]);

  const mapCenter = selectedLocation ?? DESIGNS_LOCATION_STEP.defaultCenter;
  const mapZoom = selectedLocation ? DESIGNS_LOCATION_STEP.defaultZoom : 14;

  const onMapLoad = useCallback((map: google.maps.Map) => {
    map.setTilt(0);
    map.setHeading(0);
    setMapReady(map);
  }, []);

  /* layer visibility */
  const showSolarRgb = activeLayer === "satellite";
  const showPanels = activeLayer === "panels";

  /* GeoTIFF imagery overlays */
  useImperativeOverlay(mapReady, rgbOverlay, 0.92, showSolarRgb);
  useImperativeOverlay(mapReady, maskOverlay, 0.45, showSolarRgb);

  /* Solar panels + roof outline (mask-traced perimeter, else API bounding box) */
  useImperativePanels(
    mapReady,
    visiblePanels,
    data?.panelDimensions,
    showPanels,
  );
  useImperativeRoofOutline(
    mapReady,
    roofMaskOutline,
    data?.boundingBox,
    showPanels && !isEditing && savedRoofs.length === 0,
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
            const panelArea =
              data.panelDimensions.heightM * data.panelDimensions.widthM;
            const usable = (generatedPanels?.length ?? 0) * panelArea;
            return {
              ...metric,
              value: `${formatNumber(
                generatedPanels ? usable : polygonTotalAreaM2,
              )} m²`,
            };
          }
          return {
            ...metric,
            value: `${formatNumber(data.maxArrayAreaM2)} m²`,
          };
        }

        /* panels-fit */
        if (generatedPanels !== null) {
          return { ...metric, value: String(generatedPanels.length) };
        }
        return { ...metric, value: "0" };
      }),
    [data, generatedPanels, polygonTotalAreaM2],
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

            {(loading || layersLoading || isGeneratingPanels) && (
              <p className="animate-pulse font-inter text-[14px] font-medium text-white/80">
                {isGeneratingPanels
                  ? "Saving roof and generating solar panels..."
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
                    disabled={isGeneratingPanels}
                    className="h-[33px] rounded-[6px] bg-white/90 px-[14px] font-inter text-[13px] font-semibold tracking-[-0.1504px] text-[#2094F3] shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] transition hover:bg-white"
                  >
                    + Add New Roof
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isGeneratingPanels}
                    className="h-[33px] rounded-[6px] bg-[linear-gradient(126deg,#22c55e_0%,#16a34a_100%)] px-[18px] font-inter text-[13px] font-semibold tracking-[-0.1504px] text-white shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] disabled:opacity-60"
                  >
                    {isGeneratingPanels ? "Saving..." : "Save Roof"}
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
