import type { DashboardNotificationItem } from "@/lib/notifications/types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: { unreadCount?: number };
};

type NotificationListResult = {
  items: DashboardNotificationItem[];
  unreadCount: number;
};

const inflightListFetches = new Map<string, Promise<NotificationListResult>>();
const recentListResults = new Map<
  string,
  { at: number; result: NotificationListResult }
>();
/** Reuse a fresh list response across Strict Mode remounts in dev. */
const RECENT_RESULT_MS = 5_000;

function listFetchKey(
  apiBase: string,
  params?: { unreadOnly?: boolean; limit?: number },
) {
  const sp = new URLSearchParams();
  if (params?.unreadOnly) sp.set("unreadOnly", "true");
  if (params?.limit != null) sp.set("limit", String(params.limit));
  const qs = sp.toString();
  return `${apiBase}${qs ? `?${qs}` : ""}`;
}

export async function fetchDashboardNotifications(
  apiBase: string,
  fetchWithSession: (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => Promise<Response>,
  params?: { unreadOnly?: boolean; limit?: number },
): Promise<NotificationListResult> {
  const url = listFetchKey(apiBase, params);
  const inflight = inflightListFetches.get(url);
  if (inflight) return inflight;

  const cached = recentListResults.get(url);
  if (cached && Date.now() - cached.at < RECENT_RESULT_MS) {
    return cached.result;
  }

  const runFetch = async (): Promise<NotificationListResult> => {
    const res = await fetchWithSession(url, {
      cache: "no-store",
    });
    const json = (await res.json()) as ApiEnvelope<DashboardNotificationItem[]>;
    if (!res.ok) {
      throw new Error(json.message || "Failed to load notifications");
    }
    const unreadCount =
      typeof json.meta?.unreadCount === "number" ? json.meta.unreadCount : 0;
    const result = {
      items: Array.isArray(json.data) ? json.data : [],
      unreadCount,
    };
    recentListResults.set(url, { at: Date.now(), result });
    return result;
  };

  let promise: Promise<NotificationListResult>;
  promise = runFetch().finally(() => {
    if (inflightListFetches.get(url) === promise) {
      inflightListFetches.delete(url);
    }
  });

  inflightListFetches.set(url, promise);
  return promise;
}

/** Test-only helper to reset module-level list fetch dedupe state. */
export function resetDashboardNotificationListCacheForTests() {
  inflightListFetches.clear();
  recentListResults.clear();
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
