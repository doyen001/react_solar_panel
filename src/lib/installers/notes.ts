import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

export type InstallerNote = {
  id: string;
  installerId: string;
  customerId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

function notesUrl(customerId?: string) {
  const qs = customerId
    ? `?${new URLSearchParams({ customerId }).toString()}`
    : "";
  return `/api/installers/installer-notes${qs}`;
}

export async function fetchInstallerNotes(
  customerId: string,
  init?: RequestInit,
): Promise<InstallerNote[]> {
  const res = await fetchWithInstallerSession(notesUrl(customerId), {
    cache: "no-store",
    ...init,
  });
  const json = (await res.json()) as ApiEnvelope<InstallerNote[]>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load notes");
  }
  return Array.isArray(json.data) ? json.data : [];
}

export async function createInstallerNote(input: {
  customerId: string;
  title: string;
  content: string;
}): Promise<InstallerNote> {
  const res = await fetchWithInstallerSession("/api/installers/installer-notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as ApiEnvelope<InstallerNote>;
  if (!res.ok || !json.data) {
    throw new Error(json.message || "Failed to create note");
  }
  return json.data;
}

export async function updateInstallerNote(
  id: string,
  input: { title?: string; content?: string },
): Promise<InstallerNote> {
  const res = await fetchWithInstallerSession(
    `/api/installers/installer-notes/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
  const json = (await res.json()) as ApiEnvelope<InstallerNote>;
  if (!res.ok || !json.data) {
    throw new Error(json.message || "Failed to update note");
  }
  return json.data;
}

export async function deleteInstallerNote(id: string): Promise<void> {
  const res = await fetchWithInstallerSession(
    `/api/installers/installer-notes/${id}`,
    { method: "DELETE" },
  );
  const json = (await res.json()) as ApiEnvelope<unknown>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to delete note");
  }
}
