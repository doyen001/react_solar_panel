"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SolarEstimateResult } from "@/types/solar";
import { fetchCombinedSolarData } from "./solarCombinedFetch";

type SolarEstimateState = {
  data: SolarEstimateResult | null;
  loading: boolean;
  error: string | null;
};

/**
 * Kept for anything expecting this named export. Internally now goes through
 * the combined estimate+data-layers endpoint (see solarCombinedFetch) so it
 * shares one request with useSolarLayers instead of hitting solarLimiter on
 * its own — this fetches the full combined payload just to read `.estimate`
 * off it, which is wasteful if `useSolarLayers` isn't also being called for
 * the same location; prefer `useSolarEstimate` directly in that case.
 */
export async function fetchSolarEstimate(
  lat: number,
  lng: number,
): Promise<SolarEstimateResult> {
  const { estimate } = await fetchCombinedSolarData(lat, lng);
  return estimate;
}

export function useSolarEstimate(location: {
  lat: number;
  lng: number;
} | null) {
  const [state, setState] = useState<SolarEstimateState>({
    data: null,
    loading: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const fetchEstimate = useCallback(
    async (lat: number, lng: number) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({ data: null, loading: true, error: null });

      try {
        const { estimate } = await fetchCombinedSolarData(lat, lng);
        if (controller.signal.aborted) return;
        setState({ data: estimate, loading: false, error: null });
      } catch (err) {
        if (controller.signal.aborted) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({
          data: null,
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : "Unable to reach the solar estimation service.",
        });
      }
    },
    [],
  );

  useEffect(() => {
    if (!location) return;
    void fetchEstimate(location.lat, location.lng);

    return () => {
      abortRef.current?.abort();
    };
  }, [location, fetchEstimate]);

  const retry = useCallback(() => {
    if (location) void fetchEstimate(location.lat, location.lng);
  }, [location, fetchEstimate]);

  return { ...state, retry };
}
