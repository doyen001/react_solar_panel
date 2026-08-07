import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";
import type { InstallerAppointment } from "@/lib/installers/appointments";
import type { InstallerCustomerDocument } from "@/lib/installers/customer-documents";
import type { InstallerCustomerSummary } from "@/lib/installers/customers";
import type { InstallerCustomerDesign } from "@/lib/installers/designs";
import type { InstallerNote } from "@/lib/installers/notes";
import type { InstallerProjectPhaseId } from "@/lib/installers/project-phase";
import type { InstallerTag } from "@/lib/installers/tags";
import type { InstallerTask } from "@/lib/installers/tasks";

export type InstallerHomePanelLead = {
  id: string;
  status: string;
  projectPhase: InstallerProjectPhaseId;
  suggestedProjectPhase: InstallerProjectPhaseId;
};

export type InstallerHomePanelData = {
  customer: InstallerCustomerSummary | null;
  design: InstallerCustomerDesign | null;
  documents: InstallerCustomerDocument[];
  lead: InstallerHomePanelLead | null;
  notes: InstallerNote[];
  tasks: InstallerTask[];
  tags: InstallerTag[];
  appointments: InstallerAppointment[];
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

/**
 * Single aggregated fetch for the installer home dashboard's selected
 * customer: profile, latest design, documents, lead/phase, notes, tasks,
 * tags, and appointments. Replaces what used to be four separate round trips
 * per customer selection (customer+design, documents, lead, panel).
 */
export async function fetchInstallerHomePanel(
  customerId: string,
  init?: RequestInit,
): Promise<InstallerHomePanelData> {
  const qs = new URLSearchParams({ customerId }).toString();
  const res = await fetchWithInstallerSession(
    `/api/installers/installer-home-panel?${qs}`,
    { cache: "no-store", ...init },
  );
  const json = (await res.json()) as ApiEnvelope<InstallerHomePanelData>;
  if (!res.ok || !json.data) {
    throw new Error(json.message || "Failed to load customer panel data");
  }
  return {
    customer: json.data.customer ?? null,
    design: json.data.design ?? null,
    documents: Array.isArray(json.data.documents) ? json.data.documents : [],
    lead: json.data.lead ?? null,
    notes: Array.isArray(json.data.notes) ? json.data.notes : [],
    tasks: Array.isArray(json.data.tasks) ? json.data.tasks : [],
    tags: Array.isArray(json.data.tags) ? json.data.tags : [],
    appointments: Array.isArray(json.data.appointments)
      ? json.data.appointments
      : [],
  };
}
