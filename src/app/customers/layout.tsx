"use client";

import { DashboardNotificationsProvider } from "@/components/dashboard/DashboardNotificationsProvider";

export default function CustomersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardNotificationsProvider mode="customer">
      <div className="min-h-screen font-dm-sans antialiased">{children}</div>
    </DashboardNotificationsProvider>
  );
}
