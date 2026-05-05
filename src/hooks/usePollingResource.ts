"use client";

import { useCallback, useEffect, useRef } from "react";

const DEFAULT_INTERVAL_MS = 20_000;

export type UsePollingResourceOptions = {
  /** Polling interval when the document is visible (15–30s typical). */
  intervalMs?: number;
  enabled?: boolean;
  /** Refetch when the window gains focus (only if still visible). */
  refetchOnWindowFocus?: boolean;
  /**
   * When true, the first visible mount does not trigger a fetch (use when the parent
   * already performs an initial load). Visibility resume still refetches.
   */
  skipInitialTick?: boolean;
};

/**
 * Runs a fetch on an interval while the tab is visible; pauses when hidden.
 * Pass AbortSignal into your fetch so in-flight work is cancelled on unmount or tab hide.
 */
export function usePollingResource(
  fetcher: (signal: AbortSignal) => Promise<void>,
  options?: UsePollingResourceOptions,
): { refetchNow: () => void } {
  const intervalMs = options?.intervalMs ?? DEFAULT_INTERVAL_MS;
  const enabled = options?.enabled ?? true;
  const refetchOnWindowFocus = options?.refetchOnWindowFocus ?? true;
  const skipInitialTick = options?.skipInitialTick ?? false;

  const fetcherRef = useRef(fetcher);

  /** First `startPolling` after mount (skipInitialTick only applies here, not on tab resume). */
  const isFirstVisibilitySession = useRef(true);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const refetchNow = useCallback(() => {
    const ac = new AbortController();
    void fetcherRef.current(ac.signal);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let intervalId: ReturnType<typeof setInterval> | undefined;
    let abortInFlight: (() => void) | undefined;

    const runFetch = () => {
      abortInFlight?.();
      const ac = new AbortController();
      abortInFlight = () => ac.abort();
      void fetcherRef.current(ac.signal);
    };

    const tick = () => {
      if (document.visibilityState !== "visible") return;
      runFetch();
    };

    const startPolling = () => {
      if (document.visibilityState !== "visible") return;

      const skipOnce =
        skipInitialTick && isFirstVisibilitySession.current;
      isFirstVisibilitySession.current = false;

      if (!skipOnce) {
        tick();
      }

      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(tick, intervalMs);
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
      abortInFlight?.();
      abortInFlight = undefined;
    };

    const syncVisibility = () => {
      if (document.visibilityState === "visible") {
        startPolling();
      } else {
        stopPolling();
      }
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);

    const onFocus = () => {
      if (
        refetchOnWindowFocus &&
        document.visibilityState === "visible"
      ) {
        tick();
      }
    };
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", syncVisibility);
      window.removeEventListener("focus", onFocus);
      stopPolling();
    };
  }, [enabled, intervalMs, refetchOnWindowFocus, skipInitialTick]);

  return { refetchNow };
}
