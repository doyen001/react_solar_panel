"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePollingResource } from "@/hooks/usePollingResource";
import {
  fetchInstallerActivityDashboard,
  type InstallerActivityEvent,
} from "@/lib/installers/activity";

const DEFAULT_POLL_MS = 15_000;

function mergeByNewestFirst(
  incoming: InstallerActivityEvent[],
  current: InstallerActivityEvent[],
  maxItems: number,
): InstallerActivityEvent[] {
  const byId = new Map<string, InstallerActivityEvent>();
  for (const e of incoming) byId.set(e.id, e);
  for (const e of current) {
    if (!byId.has(e.id)) byId.set(e.id, e);
  }
  return [...byId.values()]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, maxItems);
}

export type UseInstallerActivityFeedOptions = {
  limit?: number;
  /** Polling interval while the tab is visible (default 15s). */
  pollIntervalMs?: number;
};

export function useInstallerActivityFeed(
  options?: UseInstallerActivityFeedOptions,
) {
  const limit = options?.limit ?? 20;
  const pollIntervalMs = options?.pollIntervalMs ?? DEFAULT_POLL_MS;

  const [events, setEvents] = useState<InstallerActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const eventsRef = useRef(events);
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const r = await fetchInstallerActivityDashboard({ page: 1, limit });
      setEvents(r.events);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  const pollFetch = useCallback(
    async (signal: AbortSignal) => {
      const cursor = eventsRef.current[0]?.createdAt;
      try {
        const r = await fetchInstallerActivityDashboard({
          page: 1,
          limit,
          ...(cursor ? { since: cursor } : {}),
          signal,
        });
        if (signal.aborted) return;
        setEvents((current) => {
          if (!current[0]?.createdAt) {
            return r.events;
          }
          return mergeByNewestFirst(r.events, current, limit);
        });
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
      }
    },
    [limit],
  );

  useEffect(() => {
    void load();
  }, [load]);

  usePollingResource(pollFetch, {
    intervalMs: pollIntervalMs,
    skipInitialTick: true,
    refetchOnWindowFocus: true,
  });

  return { events, isLoading, error, refetch: load };
}
