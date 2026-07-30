import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

export type InstallerTask = {
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

function tasksUrl(customerId?: string) {
  const qs = customerId
    ? `?${new URLSearchParams({ customerId }).toString()}`
    : "";
  return `/api/installers/installer-tasks${qs}`;
}

export async function fetchInstallerTasks(
  customerId: string,
  init?: RequestInit,
): Promise<InstallerTask[]> {
  const res = await fetchWithInstallerSession(tasksUrl(customerId), {
    cache: "no-store",
    ...init,
  });
  const json = (await res.json()) as ApiEnvelope<InstallerTask[]>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load tasks");
  }
  return Array.isArray(json.data) ? json.data : [];
}

export async function createInstallerTask(input: {
  customerId: string;
  title: string;
  content: string;
}): Promise<InstallerTask> {
  const res = await fetchWithInstallerSession("/api/installers/installer-tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as ApiEnvelope<InstallerTask>;
  if (!res.ok || !json.data) {
    throw new Error(json.message || "Failed to create task");
  }
  return json.data;
}

export async function updateInstallerTask(
  id: string,
  input: { title?: string; content?: string },
): Promise<InstallerTask> {
  const res = await fetchWithInstallerSession(
    `/api/installers/installer-tasks/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
  const json = (await res.json()) as ApiEnvelope<InstallerTask>;
  if (!res.ok || !json.data) {
    throw new Error(json.message || "Failed to update task");
  }
  return json.data;
}

export async function deleteInstallerTask(id: string): Promise<void> {
  const res = await fetchWithInstallerSession(
    `/api/installers/installer-tasks/${id}`,
    { method: "DELETE" },
  );
  const json = (await res.json()) as ApiEnvelope<unknown>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to delete task");
  }
}
