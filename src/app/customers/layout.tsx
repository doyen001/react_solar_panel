"use client";

import { DashboardNotificationsProvider } from "@/components/dashboard/DashboardNotificationsProvider";
import { useHydrateCustomerUser } from "@/hooks/useHydrateCustomerUser";

export default function CustomersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Every customer page reads the name/initials straight from Redux, so the
  // rehydration belongs here rather than in each page.
  useHydrateCustomerUser();

  return (
    <DashboardNotificationsProvider mode="customer">
      <div className="min-h-screen font-dm-sans antialiased">{children}</div>
    </DashboardNotificationsProvider>
  );
}
