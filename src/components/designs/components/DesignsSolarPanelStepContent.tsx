"use client";

import { useCallback, useRef } from "react";
import {
  GoogleMap,
  MarkerF,
  RectangleF,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  DESIGNS_LOCATION_STEP,
  DESIGNS_SOLAR_PANEL_STEP,
  type DesignsMapLocation,
} from "@/utils/constant";
import { useSolarEstimate } from "@/hooks/useSolarEstimate";

const LIBRARIES: "places"[] = ["places"];

const MAP_CONTAINER: React.CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: "525px",
  borderRadius: "25px",
};

const SEGMENT_COLORS = [
  "rgba(255, 193, 7, 0.35)",
  "rgba(76, 175, 80, 0.35)",
  "rgba(33, 150, 243, 0.35)",
  "rgba(156, 39, 176, 0.35)",
  "rgba(255, 87, 34, 0.35)",
];

function formatNumber(n: number): string {
  return n.toLocaleString("en-AU", { maximumFractionDigits: 0 });
}

/**
 * Figma 3:4191 — AI roof detection + solar potential display.
 */
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

  const mapRef = useRef<google.maps.Map | null>(null);
  const { data, loading, error, retry } = useSolarEstimate(selectedLocation);

  const mapCenter = selectedLocation ?? DESIGNS_LOCATION_STEP.defaultCenter;
  const mapZoom = selectedLocation ? DESIGNS_LOCATION_STEP.defaultZoom : 14;

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const metrics = data
    ? [
        {
          label: "Total Roof Area",
          value: `${formatNumber(data.wholeRoofAreaM2)} m²`,
        },
        {
          label: "Usable Roof Area",
          value: `${formatNumber(data.maxArrayAreaM2)} m²`,
        },
        {
          label: "Panels that can fit on your roof",
          value: String(data.maxPanelsCount),
        },
      ]
    : DESIGNS_SOLAR_PANEL_STEP.metrics.map((m) => ({
        label: m.label,
        value: "—",
      }));

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

            {/* Roof metrics */}
            <div className="flex w-full flex-col gap-[10px]">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex h-[56px] items-center justify-between rounded-[12px] border-2 border-yellow-lemon bg-white px-[12px] pl-[14px]"
                >
                  <span className="font-inter text-[14px] font-normal tracking-[-0.1504px] text-ink">
                    {metric.label}
                  </span>
                  <span className="rounded-[6px] bg-[#FDE047] px-[14px] py-[8px] font-inter text-[14px] font-semibold tracking-[-0.1504px] text-ink shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)]">
                    {loading ? "..." : metric.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Energy / CO2 / sunshine stats */}
            {data && (
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
                  label="Roof Segments"
                  value={String(data.roofSegments.length)}
                />
              </div>
            )}

            {/* Estimated data notice */}
            {data?.estimated && (
              <p className="w-full rounded-[10px] bg-white/70 px-4 py-2 text-center font-inter text-[12px] font-medium text-ink/70">
                Google Solar imagery is not available for this location yet.
                These values are estimates based on typical Australian rooftops.
              </p>
            )}

            {/* Error state */}
            {error && (
              <div className="flex w-full flex-col items-center gap-2 rounded-[12px] border-2 border-red-300 bg-red-50 p-4 text-center">
                <p className="font-inter text-[13px] font-medium text-red-700">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={retry}
                  className="rounded-md bg-red-600 px-4 py-1.5 font-inter text-[12px] font-semibold text-white transition hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading indicator */}
            {loading && (
              <p className="font-inter text-[14px] font-medium text-white/80 animate-pulse">
                Analysing solar potential...
              </p>
            )}
          </div>
        </div>

        {/* ── Right panel: map with roof overlays ── */}
        <div className="w-full max-w-[649px] shrink-0 overflow-hidden rounded-[28px] border-[3px] border-design-accent-cyan shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)]">
          <div className="relative min-h-[525px] w-full overflow-hidden rounded-[25px]">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER}
                center={mapCenter}
                zoom={mapZoom}
                onLoad={onMapLoad}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  mapTypeId: DESIGNS_LOCATION_STEP.mapType,
                }}
              >
                {selectedLocation && (
                  <MarkerF position={selectedLocation} />
                )}

                {data?.roofSegments.map((seg, idx) => (
                  <RectangleF
                    key={`seg-${idx}`}
                    bounds={{
                      north: seg.boundingBox.ne.lat,
                      south: seg.boundingBox.sw.lat,
                      east: seg.boundingBox.ne.lng,
                      west: seg.boundingBox.sw.lng,
                    }}
                    options={{
                      fillColor: SEGMENT_COLORS[idx % SEGMENT_COLORS.length],
                      fillOpacity: 0.5,
                      strokeColor: SEGMENT_COLORS[idx % SEGMENT_COLORS.length]?.replace("0.35", "0.9"),
                      strokeWeight: 2,
                      clickable: false,
                    }}
                  />
                ))}
              </GoogleMap>
            ) : (
              <div className="flex h-full min-h-[525px] items-center justify-center rounded-[25px] bg-[linear-gradient(135deg,rgba(48,54,71,0.98)_0%,rgba(33,36,47,0.98)_100%)]">
                <p className="px-8 text-center font-source-sans text-[20px] font-medium text-white/60">
                  Loading map...
                </p>
              </div>
            )}

            <div className="absolute right-[20px] top-[20px] flex items-center gap-[10px]">
              <button
                type="button"
                className="h-[33px] rounded-[6px] bg-[linear-gradient(126deg,#2094F3_0%,#17CFCF_100%)] px-[21px] font-inter text-[14px] font-semibold tracking-[-0.1504px] text-white shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)]"
              >
                {DESIGNS_SOLAR_PANEL_STEP.mapActions.primary}
              </button>
              <button
                type="button"
                className="h-[33px] rounded-[6px] bg-[linear-gradient(139deg,#2094F3_0%,#17CFCF_100%)] px-[18px] font-inter text-[14px] font-semibold tracking-[-0.1504px] text-white shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)]"
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-[12px] border-2 border-yellow-lemon bg-white/90 px-3 py-3">
      <span className="font-inter text-[11px] font-medium uppercase tracking-wide text-ink/60">
        {label}
      </span>
      <span className="font-inter text-[16px] font-bold tracking-[-0.2px] text-ink">
        {value}
      </span>
    </div>
  );
}
