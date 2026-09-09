"use client";

import type { SolarEstimateResult } from "@/types/solar";

export interface DataLayersResult {
  rgbUrl: string;
  maskUrl: string;
  annualFluxUrl: string;
  dsmUrl: string;
  imageryQuality: string;
}

export interface CombinedSolarResult {
  estimate: SolarEstimateResult;
  dataLayers: DataLayersResult;
}

interface ApiEnvelope {
  success?: boolean;
  data?: CombinedSolarResult;
  message?: string;
}

/**
 * `useSolarEstimate` and `useSolarLayers` both need data for the same
 * location, previously via two separate requests (each hitting the backend's
 * shared solarLimiter on its own). This fetches the combined
 * `/api/solar/estimate-with-layers` endpoint once, and — if both hooks ask
 * for the same location around the same time, which is the normal case on
 * mount — de-dupes them onto a single in-flight request via `inFlight`.
 */
const inFlight = new Map<string, Promise<CombinedSolarResult>>();

function locationKey(lat: number, lng: number): string {
  return `${lat.toFixed(6)},${lng.toFixed(6)}`;
}

/**
 * No `signal` param: the underlying request is shared across callers (see
 * `inFlight` above), so one caller unmounting/aborting must not cancel the
 * fetch for whoever else is awaiting the same location. Each hook keeps its
 * own AbortController to decide whether to *act* on the result once it
 * resolves — it just doesn't cancel this shared network request itself.
 */
export async function fetchCombinedSolarData(
  lat: number,
  lng: number,
): Promise<CombinedSolarResult> {
  const key = locationKey(lat, lng);
  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const res = await fetch("/api/solar/estimate-with-layers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude: lat, longitude: lng }),
    });

    const json = (await res.json().catch(() => ({}))) as ApiEnvelope;

    if (!res.ok || !json.data) {
      throw new Error(json.message ?? "Failed to fetch solar data.");
    }

    return json.data;
  })();

  inFlight.set(key, promise);
  try {
    return await promise;
  } finally {
    inFlight.delete(key);
  }
}
