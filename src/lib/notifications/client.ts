import type { DashboardNotificationItem } from "@/lib/notifications/types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: { unreadCount?: number };
};

export async function fetchDashboardNotifications(
  apiBase: string,
  fetchWithSession: (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => Promise<Response>,
  params?: { unreadOnly?: boolean; limit?: number },
): Promise<{ items: DashboardNotificationItem[]; unreadCount: number }> {
  const sp = new URLSearchParams();
  if (params?.unreadOnly) sp.set("unreadOnly", "true");
  if (params?.limit != null) sp.set("limit", String(params.limit));
  const qs = sp.toString();
  const res = await fetchWithSession(`${apiBase}${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });
  const json = (await res.json()) as ApiEnvelope<DashboardNotificationItem[]>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to load notifications");
  }
  const unreadCount =
    typeof json.meta?.unreadCount === "number" ? json.meta.unreadCount : 0;
  return {
    items: Array.isArray(json.data) ? json.data : [],
    unreadCount,
  };
}

export async function markDashboardNotificationRead(
  apiBase: string,
  fetchWithSession: (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => Promise<Response>,
  id: string,
): Promise<DashboardNotificationItem> {
  const res = await fetchWithSession(`${apiBase}/${id}/read`, {
    method: "PATCH",
    cache: "no-store",
  });
  const json = (await res.json()) as ApiEnvelope<DashboardNotificationItem>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to mark as read");
  }
  if (!json.data) {
    throw new Error("Invalid response");
  }
  return json.data;
}

export async function markAllDashboardNotificationsRead(
  apiBase: string,
  fetchWithSession: (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => Promise<Response>,
): Promise<{ updated: number }> {
  const res = await fetchWithSession(`${apiBase}/read-all`, {
    method: "PATCH",
    cache: "no-store",
  });
  const json = (await res.json()) as ApiEnvelope<{ updated: number }>;
  if (!res.ok) {
    throw new Error(json.message || "Failed to mark all as read");
  }
  return json.data ?? { updated: 0 };
}
