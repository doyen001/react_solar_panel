"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchInstallerHomePanel,
  type InstallerHomePanelData,
  type InstallerHomePanelLead,
} from "@/lib/installers/home-panel";
import type { InstallerAppointment } from "@/lib/installers/appointments";
import type { InstallerCustomerDocument } from "@/lib/installers/customer-documents";
import type { InstallerCustomerSummary } from "@/lib/installers/customers";
import type { InstallerCustomerDesign } from "@/lib/installers/designs";
import type { InstallerNote } from "@/lib/installers/notes";
import type { InstallerTag } from "@/lib/installers/tags";
import type { InstallerTask } from "@/lib/installers/tasks";

const EMPTY_PANEL: InstallerHomePanelData = {
  customer: null,
  design: null,
  documents: [],
  lead: null,
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

function sortDocuments(documents: InstallerCustomerDocument[]) {
  return [...documents].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/**
 * Single source of truth for the installer home dashboard's selected
 * customer. One request per customer selection (`fetchInstallerHomePanel`)
 * populates customer, design, documents, lead/phase, notes, tasks, tags, and
 * appointments together. Every mutation elsewhere (creating a note, uploading
 * a document, editing the customer profile, changing the project phase, …)
 * must call one of the `upsert*`/`set*` setters below instead of refetching —
 * that is what keeps this a single request per selection rather than one per
 * edit.
 */
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

  const setCustomer = useCallback((customer: InstallerCustomerSummary) => {
    setData((prev) => ({ ...prev, customer }));
  }, []);

  const setDesign = useCallback(
    (design: InstallerCustomerDesign | null) => {
      setData((prev) => ({ ...prev, design }));
    },
    [],
  );

  const setLead = useCallback((lead: InstallerHomePanelLead | null) => {
    setData((prev) => ({ ...prev, lead }));
  }, []);

  const upsertDocument = useCallback((document: InstallerCustomerDocument) => {
    setData((prev) => ({
      ...prev,
      documents: sortDocuments([
        document,
        ...prev.documents.filter((item) => item.id !== document.id),
      ]),
    }));
  }, []);

  const removeDocument = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      documents: prev.documents.filter((item) => item.id !== id),
    }));
  }, []);

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
      customer: data.customer,
      design: data.design,
      documents: data.documents,
      lead: data.lead,
      notes: data.notes,
      tasks: data.tasks,
      tags: data.tags,
      appointments: data.appointments,
      loading,
      loadError,
      refresh: loadPanel,
      setCustomer,
      setDesign,
      setLead,
      upsertDocument,
      removeDocument,
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
      data.customer,
      data.design,
      data.documents,
      data.lead,
      data.notes,
      data.tags,
      data.tasks,
      loadError,
      loading,
      loadPanel,
      removeAppointment,
      removeDocument,
      removeNote,
      removeTag,
      removeTask,
      selectedCustomerId,
      setCustomer,
      setDesign,
      setLead,
      upsertAppointment,
      upsertDocument,
      upsertNote,
      upsertTag,
      upsertTask,
    ],
  );
}

export type InstallerHomePanelState = ReturnType<typeof useInstallerHomePanel>;
