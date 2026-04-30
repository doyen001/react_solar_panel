"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchInstallerActivityDashboard,
  type InstallerActivityEvent,
} from "@/lib/installers/activity";

export function useInstallerActivityFeed(options?: { limit?: number }) {
  const limit = options?.limit ?? 20;
  const [events, setEvents] = useState<InstallerActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    void load();
  }, [load]);

  return { events, isLoading, error, refetch: load };
}
