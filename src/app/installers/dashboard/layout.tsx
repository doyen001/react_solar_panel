"use client";

import { InstallerCustomersProvider } from "@/components/installer/dashboard/InstallerCustomersProvider";

export default function InstallerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InstallerCustomersProvider>
      <div className="min-h-screen text-warm-ink">{children}</div>
    </InstallerCustomersProvider>
  );
}
