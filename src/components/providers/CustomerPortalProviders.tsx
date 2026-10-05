"use client";

import { DashboardNotificationsProvider } from "@/components/dashboard/DashboardNotificationsProvider";
import { useHydrateCustomerUser } from "@/hooks/useHydrateCustomerUser";

/**
 * The only two things the customer portal genuinely needs client-side at the
 * layout level: Redux rehydration from the session cookie, and the
 * notification poll + context every page's header bell reads from. Isolated
 * here (instead of living directly in `customers/layout.tsx`) so that layout
 * can be a Server Component again — the "use client" that used to sit at the
 * top of the whole layout file was forcing every customer page's tree to be
 * client-rendered too, even the pages that are mostly static markup.
 */
export function CustomerPortalProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useHydrateCustomerUser();

  return (
    <DashboardNotificationsProvider mode="customer">
      {children}
    </DashboardNotificationsProvider>
  );
}
