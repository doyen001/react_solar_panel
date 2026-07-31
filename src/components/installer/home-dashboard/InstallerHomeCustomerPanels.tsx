"use client";

import { InstallerHomeNotesPanel } from "./InstallerHomeNotesPanel";
import { InstallerHomeTagsPanel } from "./InstallerHomeTagsPanel";
import { InstallerHomeTasksPanel } from "./InstallerHomeTasksPanel";
import type { InstallerHomePanelState } from "@/hooks/useInstallerHomePanel";

type Props = {
  panel: InstallerHomePanelState;
};

export function InstallerHomeCustomerPanels({ panel }: Props) {
  return (
    <>
      <InstallerHomeNotesPanel
        nodeId="3:9114"
        customerId={panel.selectedCustomerId}
        notes={panel.notes}
        loading={panel.loading}
        loadError={panel.loadError}
        onNoteUpsert={panel.upsertNote}
        onNoteRemove={panel.removeNote}
      />
      <InstallerHomeTasksPanel
        nodeId="3:9129"
        customerId={panel.selectedCustomerId}
        tasks={panel.tasks}
        loading={panel.loading}
        loadError={panel.loadError}
        onTaskUpsert={panel.upsertTask}
        onTaskRemove={panel.removeTask}
      />
      <InstallerHomeTagsPanel
        nodeId="3:9144"
        customerId={panel.selectedCustomerId}
        tags={panel.tags}
        loading={panel.loading}
        loadError={panel.loadError}
        onTagUpsert={panel.upsertTag}
        onTagRemove={panel.removeTag}
      />
    </>
  );
}
