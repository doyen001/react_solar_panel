"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInstallerNotificationSocket } from "@/hooks/useInstallerNotificationSocket";
import {
  fetchDashboardNotifications,
  markAllDashboardNotificationsRead,
  markDashboardNotificationRead,
} from "@/lib/notifications/client";
import type { DashboardNotificationItem } from "@/lib/notifications/types";
import { fetchWithCustomerSession } from "@/lib/customers/customer-fetch-client";
import { fetchWithInstallerSession } from "@/lib/installers/installer-fetch-client";

/** Installer: WS push + HTTP fallback per Phase 4 (plan ~30s poll when WS unavailable). */
const INSTALLER_POLL_MS = 30_000;
const CUSTOMER_POLL_MS = 45_000;

export type DashboardNotificationMode = "installer" | "customer";

function countUnread(rows: DashboardNotificationItem[]) {
  return rows.filter((n) => n.readAt == null).length;
}

function modeConfig(mode: DashboardNotificationMode) {
  if (mode === "customer") {
    return {
      apiBase: "/api/customers/notifications",
      fetchSession: fetchWithCustomerSession,
    } as const;
  }
  return {
    apiBase: "/api/installers/notifications",
    fetchSession: fetchWithInstallerSession,
  } as const;
}

export function useDashboardNotifications(
  mode: DashboardNotificationMode,
  options?: { limit?: number; polling?: boolean; enabled?: boolean },
) {
  const limit = options?.limit ?? 50;
  const polling = options?.polling ?? true;
  const enabled = options?.enabled ?? true;
  const { apiBase, fetchSession } = modeConfig(mode);
  const pollMs =
    mode === "installer" ? INSTALLER_POLL_MS : CUSTOMER_POLL_MS;

  const [items, setItems] = useState<DashboardNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const mergePushRef = useRef<(item: DashboardNotificationItem) => void>(
    () => {},
  );

  mergePushRef.current = (item: DashboardNotificationItem) => {
    setItems((prev) => {
      if (prev.some((n) => n.id === item.id)) return prev;
      const next = [item, ...prev];
      return next.slice(0, limit);
    });
    setUnreadCount((c) => (item.readAt == null ? c + 1 : c));
  };

  useInstallerNotificationSocket({
    enabled: Boolean(enabled && mode === "installer"),
    onNotification: (item) => mergePushRef.current(item),
  });

  const load = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!enabled) return;
      if (!opts?.silent) setIsLoading(true);
      setError(null);
      try {
        const r = await fetchDashboardNotifications(
          apiBase,
          fetchSession,
          { limit, unreadOnly: false },
        );
        setItems(r.items);
        setUnreadCount(r.unreadCount);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
        if (!opts?.silent) {
          setItems([]);
          setUnreadCount(0);
        }
      } finally {
        if (!opts?.silent) setIsLoading(false);
      }
    },
    [apiBase, enabled, fetchSession, limit],
  );

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setItems([]);
      setUnreadCount(0);
      setError(null);
      return;
    }
    void load();
  }, [enabled, load]);

  useEffect(() => {
    if (!enabled || !polling) return;
    const id = window.setInterval(
      () => void load({ silent: true }),
      pollMs,
    );
    return () => window.clearInterval(id);
  }, [enabled, polling, load, pollMs]);

  const markRead = useCallback(
    async (id: string) => {
      if (!enabled) {
        throw new Error("Notifications are disabled");
      }
      const updated = await markDashboardNotificationRead(
        apiBase,
        fetchSession,
        id,
      );
      setItems((prev) => {
        const next = prev.map((n) => (n.id === id ? updated : n));
        setUnreadCount(countUnread(next));
        return next;
      });
      return updated;
    },
    [apiBase, enabled, fetchSession],
  );

  const markAllRead = useCallback(async () => {
    if (!enabled) {
      throw new Error("Notifications are disabled");
    }
    await markAllDashboardNotificationsRead(apiBase, fetchSession);
    setItems((prev) => {
      const now = new Date().toISOString();
      const next = prev.map((n) => (n.readAt ? n : { ...n, readAt: now }));
      setUnreadCount(0);
      return next;
    });
    void load({ silent: true });
  }, [apiBase, enabled, fetchSession, load]);

  return {
    items,
    unreadCount,
    isLoading,
    error,
    refetch: load,
    markRead,
    markAllRead,
  };
}
