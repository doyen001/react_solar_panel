"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import Icon from "@/components/ui/Icons";
import {
  DESIGNS_LOCATION_STEP,
  DESIGNS_SOLAR_PANEL_MAP,
  DESIGNS_SOLAR_PANEL_STEP,
  type DesignsMapLocation,
} from "@/utils/constant";
import {
  filterPanelsForSelectedBuilding,
  filterRoofSegmentsForSelectedBuilding,
} from "@/utils/solarMapFilter";
import { useSolarEstimate } from "@/hooks/useSolarEstimate";
import { useSolarLayers, type SolarLayerType } from "@/hooks/useSolarLayers";
import type { GeoTiffOverlay } from "@/utils/geotiff";
import type { SolarEstimateResult, SolarPanel } from "@/types/solar";

const LIBRARIES: "places"[] = ["places"];

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

    // Cap at 200 panels to stay performant on large commercial roofs
    const subset = panels.slice(0, 200);
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

/* ── Main component ──────────────────────────────────────────── */

type ActiveLayer = "all" | "satellite" | "panels";

type DesignsSolarPanelStepContentProps = {
  selectedLocation: DesignsMapLocation | null;
};

export function DesignsSolarPanelStepContent({
  selectedLocation,
}: DesignsSolarPanelStepContentProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: LIBRARIES,
  });

  const [mapReady, setMapReady] = useState<google.maps.Map | null>(null);
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>("all");

  const { data, loading, error, retry } = useSolarEstimate(selectedLocation);

  const filteredPanels = useMemo(
    () =>
      filterPanelsForSelectedBuilding(
        data?.solarPanels,
        selectedLocation,
        data?.boundingBox,
        DESIGNS_SOLAR_PANEL_MAP.maxPanelDistanceFromPinMeters,
      ),
    [data?.solarPanels, data?.boundingBox, selectedLocation],
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

  const availablePanelLimit = useMemo(() => {
    if (filteredPanels.length > 0) {
      return filteredPanels.length;
    }
    return data?.maxPanelsCount ?? 0;
  }, [data?.maxPanelsCount, filteredPanels.length]);

  const [panelCountInput, setPanelCountInput] = useState("");

  const selectedPanelCount = useMemo(() => {
    const parsed = Number.parseInt(panelCountInput, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return availablePanelLimit;
    }
    return Math.min(parsed, availablePanelLimit);
  }, [availablePanelLimit, panelCountInput]);

  const visiblePanels = useMemo(
    () => filteredPanels.slice(0, selectedPanelCount),
    [filteredPanels, selectedPanelCount],
  );

  const panelCountDisplayValue = useMemo(() => {
    if (!availablePanelLimit) return "";

    const parsed = Number.parseInt(panelCountInput, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return String(availablePanelLimit);
    }

    return String(Math.min(parsed, availablePanelLimit));
  }, [availablePanelLimit, panelCountInput]);

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
    visiblePanels,
    data?.panelDimensions,
    showPanels,
  );
  useImperativeRoofSegments(
    mapReady,
    filteredPanels,
    data?.panelDimensions,
    filteredRoofSegments,
    showPanels,
  );

  /* Left panel metric rows */
  const metrics = useMemo(
    () =>
      DESIGNS_SOLAR_PANEL_STEP.metrics.map((metric) => {
        if (!data) {
          return { ...metric, value: "—" };
        }

        if (metric.id === "total-roof-area") {
          return {
            ...metric,
            value: `${formatNumber(data.wholeRoofAreaM2)} m²`,
          };
        }

        if (metric.id === "usable-roof-area") {
          return {
            ...metric,
            value: `${formatNumber(data.maxArrayAreaM2)} m²`,
          };
        }

        return { ...metric, value: String(data.maxPanelsCount) };
      }),
    [data],
  );

  const combinedError = error ?? layersError;
  const combinedRetry = () => {
    if (error) retry();
    if (layersError) layersRetry();
  };

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

            {/* Extra stats grid */}
            {/* {data && (
              <div className="grid w-full grid-cols-2 gap-[10px]">
                <StatCard
                  label="Yearly Energy"
                  value={`${formatNumber(data.yearlyEnergyDcKwh)} kWh`}
                />
                <StatCard
                  label="CO₂ Savings"
                  value={`${formatNumber(data.co2SavingsKgPerYear)} kg/yr`}
                />
                <StatCard
                  label="Sunshine"
                  value={`${formatNumber(data.maxSunshineHoursPerYear)} hrs/yr`}
                />
                <StatCard
                  label="Panels shown"
                  value={String(Math.min(visiblePanels.length, 200))}
                />
              </div>
            )} */}

            {data?.estimated && (
              <p className="w-full rounded-[10px] bg-white/70 px-4 py-2 text-center font-inter text-[12px] font-medium text-ink/70">
                Google Solar imagery is not available for this location yet.
                These values are estimates based on typical Australian rooftops.
              </p>
            )}

            {/* {combinedError && (
              <div className="flex w-full flex-col items-center gap-2 rounded-[12px] border-2 border-red-300 bg-red-50 p-4 text-center">
                <p className="font-inter text-[13px] font-medium text-red-700">
                  {combinedError}
                </p>
                <button
                  type="button"
                  onClick={combinedRetry}
                  className="rounded-md bg-red-600 px-4 py-1.5 font-inter text-[12px] font-semibold text-white transition hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )} */}

            {(loading || layersLoading) && (
              <p className="animate-pulse font-inter text-[14px] font-medium text-white/80">
                {layersLoading
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
              <button
                type="button"
                className="h-[33px] rounded-[6px] bg-[linear-gradient(126deg,#2094F3_0%,#17CFCF_100%)] px-[18px] font-inter text-[13px] font-semibold tracking-[-0.1504px] text-white shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)]"
              >
                {DESIGNS_SOLAR_PANEL_STEP.mapActions.primary}
              </button>
              <button
                type="button"
                className="h-[33px] rounded-[6px] bg-[linear-gradient(139deg,#2094F3_0%,#17CFCF_100%)] px-[14px] font-inter text-[13px] font-semibold tracking-[-0.1504px] text-white shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)]"
              >
                {DESIGNS_SOLAR_PANEL_STEP.mapActions.secondary}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

// function StatCard({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="flex flex-col items-center gap-1 rounded-[12px] border-2 border-yellow-lemon bg-white/90 px-3 py-3">
//       <span className="font-inter text-[11px] font-medium uppercase tracking-wide text-ink/60">
//         {label}
//       </span>
//       <span className="font-inter text-[16px] font-bold tracking-[-0.2px] text-ink">
//         {value}
//       </span>
//     </div>
//   );
// }

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
