"use client";

import { DashboardNotificationsProvider } from "@/components/dashboard/DashboardNotificationsProvider";
import { InstallerCustomersProvider } from "@/components/installer/dashboard/InstallerCustomersProvider";

export default function InstallerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardNotificationsProvider mode="installer">
      <InstallerCustomersProvider>
        <div className="min-h-screen text-warm-ink">{children}</div>
      </InstallerCustomersProvider>
    </DashboardNotificationsProvider>
  );
}
