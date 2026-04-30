import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type InstallerActivityActor = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: string;
};

export type InstallerActivityEvent = {
  id: string;
  entityType: string;
  entityId: string;
  eventType: string;
  summary: string;
  metadata?: unknown;
  createdAt: string;
  actorUser: InstallerActivityActor | null;
};

export async function fetchInstallerActivityDashboard(params: {
  page?: number;
  limit?: number;
}): Promise<{
  events: InstallerActivityEvent[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  const sp = new URLSearchParams();
  sp.set("dashboard", "true");
  sp.set("page", String(params.page ?? 1));
  sp.set("limit", String(params.limit ?? 20));
  const res = await fetchWithInstallerSession(
    `/api/installers/activity?${sp.toString()}`,
    { cache: "no-store" },
  );
  const json = (await res.json()) as ApiEnvelope<InstallerActivityEvent[]>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load activity");
  }
  return {
    events: Array.isArray(json.data) ? json.data : [],
    meta: json.meta?.pagination,
  };
}
