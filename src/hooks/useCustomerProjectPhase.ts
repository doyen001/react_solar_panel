"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  indexToProjectPhase,
  projectPhaseLabel,
  projectPhaseToIndex,
  type CustomerProjectPhaseState,
  type InstallerProjectPhaseId,
} from "@/lib/installers/project-phase";
import {
  fetchInstallerLeadForCustomer,
  patchInstallerLead,
} from "@/lib/installers/leads";

export function useCustomerProjectPhase(customerId: string | null) {
  const selectedCustomerId =
    customerId && !customerId.startsWith("fallback-") ? customerId : null;

  const [state, setState] = useState<CustomerProjectPhaseState | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!selectedCustomerId) {
      setState(null);
      setLoadError(null);
      return;
    }

    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchInstallerLeadForCustomer(selectedCustomerId);
      setState(data);
    } catch (e) {
      setState(null);
      setLoadError(
        e instanceof Error ? e.message : "Could not load project phase",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedCustomerId]);

  useEffect(() => {
    void load();
  }, [load]);

  const activeIndex = useMemo(
    () => projectPhaseToIndex(state?.projectPhase),
    [state?.projectPhase],
  );

  const suggestedIndex = useMemo(
    () => projectPhaseToIndex(state?.suggestedProjectPhase),
    [state?.suggestedProjectPhase],
  );

  const setPhaseByIndex = useCallback(
    async (index: number) => {
      if (!state?.leadId) return;
      const nextPhase = indexToProjectPhase(index);
      if (nextPhase === state.projectPhase) return;

      setUpdating(true);
      const previous = state;
      setState((current) =>
        current ? { ...current, projectPhase: nextPhase } : current,
      );

      try {
        const updated = await patchInstallerLead(state.leadId, {
          projectPhase: nextPhase,
        });
        // setState((current) =>
        //   current
        //     ? {
        //         ...current,
        //         projectPhase: (updated?.projectPhase as InstallerProjectPhaseId) ?? nextPhase,
        //         leadStatus: updated?.status ?? current.leadStatus,
        //       }
        //     : current,
        // );
        // toast.success(`Project phase set to ${projectPhaseLabel(nextPhase)}.`);
      } catch (e) {
        setState(previous);
        toast.error(
          e instanceof Error ? e.message : "Could not update project phase",
        );
      } finally {
        setUpdating(false);
      }
    },
    [state],
  );

  const applySuggestedPhase = useCallback(async () => {
    if (!state) return;
    const index = projectPhaseToIndex(state.suggestedProjectPhase);
    await setPhaseByIndex(index);
  }, [setPhaseByIndex, state]);

  return {
    state,
    loading,
    updating,
    loadError,
    activeIndex,
    suggestedIndex,
    hasLead: Boolean(state?.leadId),
    setPhaseByIndex,
    applySuggestedPhase,
    refresh: load,
  };
}
