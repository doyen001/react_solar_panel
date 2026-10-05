import { CustomerDesignPageClient } from "@/components/customer/design/CustomerDesignPageClient";
import {
  fetchCustomerDesignsOnServer,
  fetchReferralOverviewOnServer,
} from "@/lib/server/customer-design-page-data";

// Server Component: designs + referrals are fetched here, in parallel,
// before any HTML reaches the browser — previously both were fetched from
// two separate client effects after hydration, and the share-link mint
// waited on the first of those to finish before it could even start. See
// CustomerDesignPageClient for how a server-fetch failure (e.g. an expired
// access-token cookie) falls back to the original client-side behavior.
export default async function CustomerDesignPage() {
  const [initialDesigns, initialReferrals] = await Promise.all([
    fetchCustomerDesignsOnServer(),
    fetchReferralOverviewOnServer(),
  ]);

  return (
    <CustomerDesignPageClient
      initialDesigns={initialDesigns}
      initialReferrals={initialReferrals}
    />
  );
}
