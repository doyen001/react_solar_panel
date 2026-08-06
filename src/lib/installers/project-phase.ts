export const INSTALLER_PROJECT_PHASES = [
  {
    id: "DESIGN_AND_PERMISSIONS",
    label: "Design and Permissions",
  },
  {
    id: "INSTALLATION",
    label: "Installation",
  },
  {
    id: "COMMISSIONING",
    label: "Commissioning",
  },
  {
    id: "MAINTENANCE_AND_MONITORING",
    label: "Maintenance and Monitoring",
  },
] as const;

export type InstallerProjectPhaseId =
  (typeof INSTALLER_PROJECT_PHASES)[number]["id"];

export const INSTALLER_HOME_PIPELINE_PHASES = INSTALLER_PROJECT_PHASES.map(
  (phase) => phase.label,
);

export function projectPhaseToIndex(
  phase: InstallerProjectPhaseId | null | undefined,
): number {
  if (!phase) return 0;
  const idx = INSTALLER_PROJECT_PHASES.findIndex((item) => item.id === phase);
  return idx >= 0 ? idx : 0;
}

export function indexToProjectPhase(
  index: number,
): InstallerProjectPhaseId {
  return INSTALLER_PROJECT_PHASES[index]?.id ?? "DESIGN_AND_PERMISSIONS";
}

export function projectPhaseLabel(
  phase: InstallerProjectPhaseId | null | undefined,
): string {
  const item = INSTALLER_PROJECT_PHASES.find((entry) => entry.id === phase);
  return item?.label ?? INSTALLER_PROJECT_PHASES[0].label;
}

export type CustomerProjectPhaseState = {
  leadId: string;
  projectPhase: InstallerProjectPhaseId;
  suggestedProjectPhase: InstallerProjectPhaseId;
  leadStatus?: string;
};
