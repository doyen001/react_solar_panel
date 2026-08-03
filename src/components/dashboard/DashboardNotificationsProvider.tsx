"use client";

import { createContext, useContext } from "react";
import {
  useDashboardNotifications,
  type DashboardNotificationMode,
} from "@/lib/notifications/useDashboardNotifications";
import { useAppSelector } from "@/lib/store/hooks";

type DashboardNotificationsContextValue = ReturnType<
  typeof useDashboardNotifications
>;

const DashboardNotificationsContext =
  createContext<DashboardNotificationsContextValue | null>(null);

export function DashboardNotificationsProvider({
  mode,
  children,
}: {
  mode: DashboardNotificationMode;
  children: React.ReactNode;
}) {
  const user = useAppSelector((s) =>
    mode === "customer" ? s.customerAuth.user : s.installerAuth.user,
  );
  const enabled = Boolean(user);

  const value = useDashboardNotifications(mode, {
    enabled,
    polling: enabled,
  });

  return (
    <DashboardNotificationsContext.Provider value={value}>
      {children}
    </DashboardNotificationsContext.Provider>
  );
}

export function useDashboardNotificationsContext() {
  const ctx = useContext(DashboardNotificationsContext);
  if (!ctx) {
    throw new Error(
      "useDashboardNotificationsContext must be used within DashboardNotificationsProvider",
    );
  }
  return ctx;
}

export function useDashboardNotificationsContextOptional() {
  return useContext(DashboardNotificationsContext);
}
