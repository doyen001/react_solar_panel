"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  indexToProjectPhase,
  projectPhaseToIndex,
  type InstallerProjectPhaseId,
} from "@/lib/installers/project-phase";
import { patchInstallerLead } from "@/lib/installers/leads";
import type { InstallerHomePanelLead } from "@/lib/installers/home-panel";

/**
 * Project-phase controls for the selected customer's lead.
 *
 * The lead itself is not fetched here — it comes from the single
 * `installer-home-panel` request (`useInstallerHomePanel`) and is passed in
 * as `lead`. This hook only derives phase indices from it and performs the
 * PATCH on change, writing the optimistic/confirmed result back through
 * `setLead` so no extra fetch is needed on either side of the mutation.
 */
export function useCustomerProjectPhase(
  lead: InstallerHomePanelLead | null,
  setLead: (lead: InstallerHomePanelLead | null) => void,
  loading: boolean,
) {
  const [updating, setUpdating] = useState(false);

  const activeIndex = useMemo(
    () => projectPhaseToIndex(lead?.projectPhase),
    [lead?.projectPhase],
  );

  const suggestedIndex = useMemo(
    () => projectPhaseToIndex(lead?.suggestedProjectPhase),
    [lead?.suggestedProjectPhase],
  );

  const setPhaseByIndex = useCallback(
    async (index: number) => {
      if (!lead?.id) return;
      const nextPhase = indexToProjectPhase(index);
      if (nextPhase === lead.projectPhase) return;

      setUpdating(true);
      const previous = lead;
      setLead({ ...lead, projectPhase: nextPhase });

      try {
        await patchInstallerLead(lead.id, { projectPhase: nextPhase });
      } catch (e) {
        setLead(previous);
        toast.error(
          e instanceof Error ? e.message : "Could not update project phase",
        );
      } finally {
        setUpdating(false);
      }
    },
    [lead, setLead],
  );

  const applySuggestedPhase = useCallback(async () => {
    if (!lead) return;
    const index = projectPhaseToIndex(lead.suggestedProjectPhase);
    await setPhaseByIndex(index);
  }, [lead, setPhaseByIndex]);

  return {
    lead,
    loading,
    updating,
    activeIndex,
    suggestedIndex,
    hasLead: Boolean(lead?.id),
    setPhaseByIndex,
    applySuggestedPhase,
  };
}

export type { InstallerProjectPhaseId };
