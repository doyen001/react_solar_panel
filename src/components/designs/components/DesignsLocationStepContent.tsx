"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import Icon from "@/components/ui/Icons";
import {
  DESIGNS_LOCATION_STEP,
  type DesignsMapLocation,
} from "@/utils/constant";

const LIBRARIES: "places"[] = ["places"];

const MAP_CONTAINER: React.CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: "525px",
  borderRadius: "25px",
};

type Suggestion = {
  placeId: string;
  description: string;
};

/**
 * Figma 3:4160 — address entry card + satellite roof map.
 * - AutocompleteService fetches predictions as the user types.
 * - Selecting a suggestion pans the map and drops a draggable pin.
 * - Dragging the pin reverse-geocodes the new position back to the input.
 */
type DesignsLocationStepContentProps = {
  selectedAddress: string;
  selectedLocation: DesignsMapLocation | null;
  onAddressChange: (address: string) => void;
  onLocationChange: (location: DesignsMapLocation) => void;
};

export function DesignsLocationStepContent({
  selectedAddress,
  selectedLocation,
  onAddressChange,
  onLocationChange,
}: DesignsLocationStepContentProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: LIBRARIES,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const pendingMove = useRef<{ lat: number; lng: number; zoom: number } | null>(
    null,
  );
  const mapDivRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [center] = useState(DESIGNS_LOCATION_STEP.defaultCenter);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  /* ── cleanup marker on unmount ────────────────────────────── */

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      markerRef.current?.setMap(null);
    };
  }, []);

  /* ── reverse geocode a LatLng → update address input ─────── */

  const reverseGeocode = useCallback(
    (latLng: google.maps.LatLng) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
          onAddressChange(results[0].formatted_address);
        }
      });
    },
    [onAddressChange],
  );

  /* ── place / move draggable marker ───────────────────────── */

  const placeMarker = useCallback(
    (loc: { lat: number; lng: number }) => {
      if (!mapRef.current) return;

      const latLng = new google.maps.LatLng(loc.lat, loc.lng);

      if (markerRef.current) {
        markerRef.current.setPosition(latLng);
      } else {
        const marker = new google.maps.Marker({
          position: latLng,
          map: mapRef.current,
          draggable: true,
          animation: google.maps.Animation.DROP,
        });

        marker.addListener("dragend", () => {
          const pos = marker.getPosition();
          if (!pos) return;
          onLocationChange({ lat: pos.lat(), lng: pos.lng() });
          mapRef.current?.panTo(pos);
          reverseGeocode(pos);
        });

        markerRef.current = marker;
      }
    },
    [onLocationChange, reverseGeocode],
  );

  /* ── pan map + drop pin ───────────────────────────────────── */

  const moveTo = useCallback(
    (loc: { lat: number; lng: number }, z: number) => {
      onLocationChange(loc);
      if (mapRef.current) {
        mapRef.current.panTo(loc);
        mapRef.current.setZoom(z);
        placeMarker(loc);
      } else {
        pendingMove.current = { ...loc, zoom: z };
      }
    },
    [onLocationChange, placeMarker],
  );

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      if (pendingMove.current) {
        const { lat, lng, zoom } = pendingMove.current;
        map.panTo({ lat, lng });
        map.setZoom(zoom);
        placeMarker({ lat, lng });
        pendingMove.current = null;
      }
    },
    [placeMarker],
  );

  /* ── geolocation on mount ─────────────────────────────────── */

  useEffect(() => {
    if (selectedLocation || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        moveTo(
          { lat: coords.latitude, lng: coords.longitude },
          DESIGNS_LOCATION_STEP.defaultZoom,
        ),
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, [moveTo, selectedLocation]);

  useEffect(() => {
    if (!selectedLocation) return;
    moveTo(selectedLocation, DESIGNS_LOCATION_STEP.defaultZoom);
  }, [moveTo, selectedLocation]);

  /* ── close dropdown on outside click ─────────────────────── */

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ── autocomplete predictions ─────────────────────────────── */

  const fetchSuggestions = useCallback(
    (value: string) => {
      if (!isLoaded || !value.trim() || !google?.maps?.places) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: "au" },
          types: ["address"],
        },
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(
              predictions.map((p) => ({
                placeId: p.place_id,
                description: p.description,
              })),
            );
            setIsOpen(true);
            setActiveIndex(-1);
          } else {
            setSuggestions([]);
            setIsOpen(false);
          }
        },
      );
    },
    [isLoaded],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onAddressChange(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
    },
    [fetchSuggestions, onAddressChange],
  );

  /* ── place selection → move map ───────────────────────────── */

  const selectSuggestion = useCallback(
    (suggestion: Suggestion) => {
      onAddressChange(suggestion.description);
      setSuggestions([]);
      setIsOpen(false);

      if (!isLoaded || !google?.maps?.places || !mapDivRef.current) return;

      const service = new google.maps.places.PlacesService(mapDivRef.current);
      service.getDetails(
        { placeId: suggestion.placeId, fields: ["geometry"] },
        (place, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place?.geometry?.location
          ) {
            moveTo(
              {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
              DESIGNS_LOCATION_STEP.defaultZoom,
            );
          }
        },
      );
    },
    [isLoaded, moveTo, onAddressChange],
  );

  /* ── keyboard navigation ──────────────────────────────────── */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          selectSuggestion(suggestions[activeIndex]);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    [isOpen, activeIndex, suggestions, selectSuggestion],
  );

  /* ── render ───────────────────────────────────────────────── */

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-1 flex-col px-4 pt-8 sm:px-8 sm:pt-10 lg:px-[81px] lg:pt-[37px]">
      <div className="flex w-full max-w-[1278px] flex-1 flex-col items-center justify-center gap-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-[38px]">
        {/* ── Left panel ── */}
        <div className="flex min-h-[525px] w-full max-w-[591px] shrink-0 flex-col items-center rounded-[46px] border-[3px] border-design-accent-cyan bg-linear-to-r from-yellow-lemon to-orange-amber px-8 py-12 shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] sm:px-10 lg:px-[46px]">
          <div className="flex w-full max-w-[505px] flex-1 flex-col justify-center gap-[48px]">
            <h2
              className="w-full max-w-[495px] text-center font-source-sans text-[clamp(28px,4.8vw,40px)] font-bold capitalize leading-tight text-white"
              style={{ letterSpacing: "0.248px" }}
            >
              {DESIGNS_LOCATION_STEP.title}
            </h2>

            <div className="flex flex-col gap-[12px]">
              <span className="font-inter text-[15.531px] font-medium leading-[22.188px] tracking-[-0.1668px] text-[#191919]">
                {DESIGNS_LOCATION_STEP.inputLabel}
              </span>

              {/* Input + dropdown wrapper */}
              <div ref={wrapperRef} className="relative">
                <div className="flex h-[56px] items-center gap-[10px] rounded-[11.094px] border border-yellow-lemon bg-white px-[17.75px]">
                  <Icon
                    name="LocationPin"
                    className="size-[24px] shrink-0 text-[#878787]"
                  />
                  {isLoaded ? (
                    <input
                      value={selectedAddress}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      onFocus={() => {
                        if (suggestions.length > 0) setIsOpen(true);
                      }}
                      placeholder={DESIGNS_LOCATION_STEP.inputPlaceholder}
                      autoComplete="off"
                      className="h-full flex-1 border-0 bg-transparent font-inter text-[12px] font-medium tracking-[-0.1668px] text-[#191919] outline-none placeholder:text-[#878787]"
                    />
                  ) : (
                    <span className="font-inter text-[12px] font-medium tracking-[-0.1668px] text-[#878787]">
                      Loading...
                    </span>
                  )}
                </div>

                {/* Suggestions dropdown */}
                {isOpen && suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.12)]">
                    {suggestions.map((s, idx) => (
                      <li
                        key={s.placeId}
                        onMouseDown={() => selectSuggestion(s)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`flex cursor-pointer items-center gap-3 px-4 py-3 font-inter text-[12px] font-medium leading-snug tracking-[-0.1668px] text-[#191919] transition-colors ${
                          idx === activeIndex ? "bg-gray-3" : "hover:bg-gray-2"
                        } ${idx !== 0 ? "border-t border-gray-4" : ""}`}
                      >
                        <Icon
                          name="LocationPin"
                          className="size-[16px] shrink-0 text-[#878787]"
                        />
                        {s.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden div required by PlacesService */}
        <div ref={mapDivRef} className="hidden" />

        {/* ── Right panel: map ── */}
        <div className="w-full max-w-[649px] shrink-0 overflow-hidden rounded-[28px] border-[3px] border-design-accent-cyan shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)]">
          <div className="relative h-full min-h-[525px] w-full">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER}
                center={center}
                zoom={14}
                onLoad={onMapLoad}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  mapTypeId: DESIGNS_LOCATION_STEP.mapType,
                }}
              />
            ) : (
              <div className="flex h-full min-h-[525px] items-center justify-center rounded-[25px] bg-[linear-gradient(135deg,rgba(48,54,71,0.98)_0%,rgba(33,36,47,0.98)_100%)]">
                <p className="px-8 text-center font-source-sans text-[20px] font-medium text-white/60">
                  Loading map...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
