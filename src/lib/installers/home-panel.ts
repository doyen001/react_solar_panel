import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";
import type { InstallerAppointment } from "@/lib/installers/appointments";
import type { InstallerNote } from "@/lib/installers/notes";
import type { InstallerTag } from "@/lib/installers/tags";
import type { InstallerTask } from "@/lib/installers/tasks";

export type InstallerHomePanelData = {
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
    notes: Array.isArray(json.data.notes) ? json.data.notes : [],
    tasks: Array.isArray(json.data.tasks) ? json.data.tasks : [],
    tags: Array.isArray(json.data.tags) ? json.data.tags : [],
    appointments: Array.isArray(json.data.appointments)
      ? json.data.appointments
      : [],
  };
}
