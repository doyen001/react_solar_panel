"use client";

import { useEffect, useState } from "react";
import {
  fetchCustomerProjectJourney,
  type ProjectJourney,
} from "@/lib/project-journey";

type State = {
  journey: ProjectJourney | null;
  loading: boolean;
  error: string | null;
};

/**
 * Loads the signed-in customer's journey. The backend already filters this to
 * customer-visible milestones, so nothing internal needs stripping here.
 */
export function useCustomerProjectJourney(): State {
  const [state, setState] = useState<State>({
    journey: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetchCustomerProjectJourney()
      .then((journey) => {
        if (cancelled) return;
        setState({ journey, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState({
          journey: null,
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : "Could not load your project timeline",
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
