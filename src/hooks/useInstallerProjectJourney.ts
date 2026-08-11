"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchInstallerProjectJourney,
  type ProjectJourney,
} from "@/lib/project-journey";

/**
 * The installer's view of the shared project journey for one lead.
 *
 * Milestones are the source of truth; `journey.phaseIndex` is the roll-up the
 * pipeline strip renders, so the coarse phase can never disagree with the
 * detailed milestone list.
 */
export function useInstallerProjectJourney(leadId: string | null | undefined) {
  const [journey, setJourney] = useState<ProjectJourney | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      setJourney(await fetchInstallerProjectJourney(id));
    } catch (err) {
      setJourney(null);
      setError(
        err instanceof Error ? err.message : "Could not load project milestones",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!leadId) {
      setJourney(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchInstallerProjectJourney(leadId)
      .then((next) => {
        if (!cancelled) setJourney(next);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setJourney(null);
        setError(
          err instanceof Error
            ? err.message
            : "Could not load project milestones",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [leadId]);

  return {
    journey,
    loading,
    error,
    hasLead: Boolean(leadId),
    /** Mutations return the recomputed journey, so callers just swap it in. */
    setJourney,
    reload: useCallback(() => {
      if (leadId) void load(leadId);
    }, [leadId, load]),
  };
}
