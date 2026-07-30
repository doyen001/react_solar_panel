import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

export type InstallerTag = {
  id: string;
  installerId: string;
  customerId: string;
  value: string;
  createdAt: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

function tagsUrl(customerId?: string) {
  const qs = customerId
    ? `?${new URLSearchParams({ customerId }).toString()}`
    : "";
  return `/api/installers/installer-tags${qs}`;
}

export async function fetchInstallerTags(
  customerId: string,
  init?: RequestInit,
): Promise<InstallerTag[]> {
  const res = await fetchWithInstallerSession(tagsUrl(customerId), {
    cache: "no-store",
    ...init,
  });
  const json = (await res.json()) as ApiEnvelope<InstallerTag[]>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load tags");
  }
  return Array.isArray(json.data) ? json.data : [];
}

export async function createInstallerTag(input: {
  customerId: string;
  value: string;
}): Promise<InstallerTag> {
  const res = await fetchWithInstallerSession("/api/installers/installer-tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as ApiEnvelope<InstallerTag>;
  if (!res.ok || !json.data) {
    throw new Error(json.message || "Failed to create tag");
  }
  return json.data;
}

export async function deleteInstallerTag(id: string): Promise<void> {
  const res = await fetchWithInstallerSession(
    `/api/installers/installer-tags/${id}`,
    { method: "DELETE" },
  );
  const json = (await res.json()) as ApiEnvelope<unknown>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to delete tag");
  }
}
