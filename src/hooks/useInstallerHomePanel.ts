"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchInstallerHomePanel,
  type InstallerHomePanelData,
} from "@/lib/installers/home-panel";
import type { InstallerAppointment } from "@/lib/installers/appointments";
import type { InstallerNote } from "@/lib/installers/notes";
import type { InstallerTag } from "@/lib/installers/tags";
import type { InstallerTask } from "@/lib/installers/tasks";

const EMPTY_PANEL: InstallerHomePanelData = {
  notes: [],
  tasks: [],
  tags: [],
  appointments: [],
};

function sortNotes(notes: InstallerNote[]) {
  return [...notes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

function sortTasks(tasks: InstallerTask[]) {
  return [...tasks].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

function sortTags(tags: InstallerTag[]) {
  return [...tags].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

function sortAppointments(appointments: InstallerAppointment[]) {
  return [...appointments].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );
}

export function useInstallerHomePanel(customerId: string | null) {
  const selectedCustomerId =
    customerId && !customerId.startsWith("fallback-") ? customerId : null;

  const [data, setData] = useState<InstallerHomePanelData>(EMPTY_PANEL);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadPanel = useCallback(async () => {
    if (!selectedCustomerId) {
      setData(EMPTY_PANEL);
      setLoadError(null);
      return;
    }

    setLoading(true);
    setLoadError(null);
    try {
      const panel = await fetchInstallerHomePanel(selectedCustomerId);
      setData(panel);
    } catch (e) {
      setData(EMPTY_PANEL);
      setLoadError(
        e instanceof Error ? e.message : "Failed to load customer panel data",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedCustomerId]);

  useEffect(() => {
    void loadPanel();
  }, [loadPanel]);

  const upsertNote = useCallback((note: InstallerNote) => {
    setData((prev) => ({
      ...prev,
      notes: sortNotes([
        note,
        ...prev.notes.filter((item) => item.id !== note.id),
      ]),
    }));
  }, []);

  const removeNote = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.filter((item) => item.id !== id),
    }));
  }, []);

  const upsertTask = useCallback((task: InstallerTask) => {
    setData((prev) => ({
      ...prev,
      tasks: sortTasks([
        task,
        ...prev.tasks.filter((item) => item.id !== task.id),
      ]),
    }));
  }, []);

  const removeTask = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((item) => item.id !== id),
    }));
  }, []);

  const upsertTag = useCallback((tag: InstallerTag) => {
    setData((prev) => ({
      ...prev,
      tags: sortTags([tag, ...prev.tags.filter((item) => item.id !== tag.id)]),
    }));
  }, []);

  const removeTag = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tags: prev.tags.filter((item) => item.id !== id),
    }));
  }, []);

  const upsertAppointment = useCallback((appointment: InstallerAppointment) => {
    setData((prev) => ({
      ...prev,
      appointments: sortAppointments([
        appointment,
        ...prev.appointments.filter((item) => item.id !== appointment.id),
      ]),
    }));
  }, []);

  const removeAppointment = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.filter((item) => item.id !== id),
    }));
  }, []);

  return useMemo(
    () => ({
      selectedCustomerId,
      notes: data.notes,
      tasks: data.tasks,
      tags: data.tags,
      appointments: data.appointments,
      loading,
      loadError,
      upsertNote,
      removeNote,
      upsertTask,
      removeTask,
      upsertTag,
      removeTag,
      upsertAppointment,
      removeAppointment,
    }),
    [
      data.appointments,
      data.notes,
      data.tags,
      data.tasks,
      loadError,
      loading,
      removeAppointment,
      removeNote,
      removeTag,
      removeTask,
      selectedCustomerId,
      upsertAppointment,
      upsertNote,
      upsertTag,
      upsertTask,
    ],
  );
}

export type InstallerHomePanelState = ReturnType<typeof useInstallerHomePanel>;
