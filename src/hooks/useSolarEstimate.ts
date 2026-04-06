"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SolarEstimateResult } from "@/types/solar";

type SolarEstimateState = {
  data: SolarEstimateResult | null;
  loading: boolean;
  error: string | null;
};

type SolarEstimateApiResponse = {
  success?: boolean;
  data?: SolarEstimateResult;
  message?: string;
};

export async function fetchSolarEstimate(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<SolarEstimateResult> {
  const res = await fetch("/api/solar/estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude: lat, longitude: lng }),
    signal,
  });

  const json = (await res.json()) as SolarEstimateApiResponse;

  if (!res.ok || !json.data) {
    throw new Error(json.message ?? "Failed to fetch solar estimate.");
  }

  return json.data;
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
        const data = await fetchSolarEstimate(lat, lng, controller.signal);
        setState({ data, loading: false, error: null });
      } catch (err) {
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
