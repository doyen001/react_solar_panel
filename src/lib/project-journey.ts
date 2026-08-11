import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";
import { fetchWithCustomerSession } from "@/lib/customers/customer-fetch-client";
import type { InstallerProjectPhaseId } from "@/lib/installers/project-phase";

/**
 * One journey model shared by the installer pipeline bar and the customer
 * timeline. Stage definitions live on the backend
 * (`modules/project-journey/journey.catalog.ts`) and arrive fully resolved, so
 * neither portal hardcodes the list and the two can never drift apart.
 *
 * The customer response is the same shape, pre-filtered to customer-visible
 * milestones with customer-facing wording.
 */
export type MilestoneState = "completed" | "current" | "upcoming";

export type JourneyMilestone = {
  key: string;
  label: string;
  phase: InstallerProjectPhaseId;
  audience: "both" | "installer";
  hint?: string;
  state: MilestoneState;
  completedAt: string | null;
};

export type ProjectJourney = {
  leadId: string;
  currentMilestoneKey: string;
  /** Index of the current step within `milestones` as returned to this viewer. */
  currentIndex: number;
  projectPhase: InstallerProjectPhaseId;
  phaseIndex: number;
  phases: InstallerProjectPhaseId[];
  milestones: JourneyMilestone[];
  completedCount: number;
  totalCount: number;
  percentComplete: number;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

async function readEnvelope<T>(res: Response, fallback: string): Promise<T> {
  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!res.ok) {
    throw new Error(json.message || fallback);
  }
  return json.data as T;
}

export async function fetchInstallerProjectJourney(
  leadId: string,
): Promise<ProjectJourney> {
  const res = await fetchWithInstallerSession(
    `/api/installers/project-journey/${encodeURIComponent(leadId)}`,
  );
  return readEnvelope<ProjectJourney>(res, "Could not load the project journey");
}

/** Installer clicked a step on the progress bar. */
export async function setInstallerCurrentMilestone(
  leadId: string,
  key: string,
): Promise<ProjectJourney> {
  const res = await fetchWithInstallerSession(
    `/api/installers/project-journey/${encodeURIComponent(
      leadId,
    )}/current-milestone`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    },
  );
  return readEnvelope<ProjectJourney>(res, "Could not update the project step");
}

/** Returns null when the signed-in customer has no project yet. */
export async function fetchCustomerProjectJourney(): Promise<ProjectJourney | null> {
  const res = await fetchWithCustomerSession("/api/customers/project-journey");
  const journey = await readEnvelope<ProjectJourney | null>(
    res,
    "Could not load your project timeline",
  );
  return journey ?? null;
}

export function formatMilestoneDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Index of the current step, for progress bars that take a single index. */
export function currentStepIndex(journey: ProjectJourney): number {
  return journey.currentIndex;
}

/**
 * The step a coarse phase click should land on: the first step of that phase.
 * Keeps the 4-phase strip and the detailed step bar driving the same pointer
 * instead of two competing notions of progress.
 */
export function firstMilestoneKeyOfPhase(
  journey: ProjectJourney,
  phaseIndex: number,
): string | null {
  const phase = journey.phases[phaseIndex];
  if (!phase) return null;
  return journey.milestones.find((m) => m.phase === phase)?.key ?? null;
}
